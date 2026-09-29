"use client";

/**
 * The house dialog shell, and the only modal in the study-resource feature.
 *
 * It is lifted out of `StudyResourcesPage` rather than invented. The classes are
 * the ones that modal already used — `fixed inset-0 z-50 … bg-gray-900/50 p-5`
 * over `w-full max-w-sm rounded-lg bg-white p-6` — because the point of this
 * change is that the coin screens look like the login screen, not like a new
 * system.
 *
 * What it adds is the behaviour the old markup was missing. That modal declared
 * `role="dialog"` and `aria-modal="true"` and then did nothing: no focus move,
 * no focus trap, no Escape, and no `aria-labelledby`. A keyboard user who opened
 * it was left with focus on the card button behind the overlay and no way out
 * but the mouse. That is a live WCAG 2.1.1 failure, and every dialog in this
 * feature inherits the fix rather than repeating it.
 */
import React, { useCallback, useEffect, useRef } from "react";

/** Every interactive element worth trapping focus to, in DOM order. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** `sm` is the house dialog; `md` is the one step wider the earn list needs. */
export type ModalSize = "sm" | "md";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Required. A dialog with no accessible name is not navigable. */
  labelledBy: string;
  /** Required. The dialog always has something to say beyond its title. */
  describedBy: string;
  size?: ModalSize;
  /** Applied to the panel, for the cases that need to scroll on a short screen. */
  panelClassName?: string;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  labelledBy,
  describedBy,
  size = "sm",
  panelClassName = "",
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Captured on open so focus can be handed back to the control that opened the
  // dialog on close. This is the step usually missed, and it is the one that
  // makes a card feel like it responded rather than swallowed the click.
  const returnFocusTo = useRef<HTMLElement | null>(null);

  // The latest onClose, kept in an effect rather than assigned during render:
  // writing a ref while rendering is exactly what the react-hooks lint rule
  // forbids, and with a concurrent renderer a render can be thrown away, which
  // would leave this pointing at a callback from a discarded tree.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    returnFocusTo.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Focus the marked control, not the heading: a keyboard user who opened a
    // confirmation should be able to act immediately, not tab to the answer.
    const initial =
      panelRef.current?.querySelector<HTMLElement>("[data-modal-initial]") ??
      panelRef.current;
    initial?.focus();

    // The page behind must not scroll under the overlay. The previous value is
    // restored rather than cleared, so a second dialog opening on top of the
    // first cannot leave the page unlocked when it closes.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusTo.current?.focus?.();
    };
  }, [open]);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCloseRef.current();
      return;
    }
    if (event.key !== "Tab") return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => element.offsetParent !== null || element === document.activeElement,
    );
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    // Wrapping at both ends, not just the end: Tab off the first control has to
    // come back to the last one, or Shift-Tab off the last escapes the dialog
    // and focus lands on the page behind the overlay.
    if (event.shiftKey && (active === first || !panel.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-5"
      onClick={(event) => {
        // Backdrop click-to-close, preserved from the original. The guard is
        // what stops a click inside the panel from closing the dialog.
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`w-full ${
          size === "md" ? "max-w-md" : "max-w-sm"
        } rounded-lg bg-white p-6 ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
