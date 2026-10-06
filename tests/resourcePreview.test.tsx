/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import ResourceCard from "@/components/studyResources/ResourceCard";
import type { StudyResource } from "@/services/studyResourcesApi";

/**
 * The sample button's contract: present exactly where a sample can exist
 * (PDF documents — never videos, never office formats), NOT a coin state (it
 * renders the same with the gate off), and the modal speaks the three
 * outcomes — sample, "too short to sample", and a retryable failure.
 */

jest.mock("@/services/api", () => ({
  stripHtml: (value: string | null | undefined) =>
    (value ?? "").replace(/<[^>]*>/g, "").trim(),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const pdfResource = {
  id: 812,
  title: "Thermodynamics Notes",
  description: "Chapter notes",
  resource_type: "study-notes",
  course: "BSc CSIT",
  year: "2081",
  file_name: "notes.pdf",
  file_url: "/uploads/notes.pdf",
  file_size: 12_345_678,
  mime_type: "application/pdf",
  downloads: 24,
  created_at: "2026-09-01T00:00:00Z",
} as StudyResource;

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render(resource: StudyResource = pdfResource) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(
      <ResourceCard
        resource={resource}
        variant="document"
        access={null}
        onPrimaryAction={() => {}}
        onSignIn={() => {}}
      />,
    );
  });
  return container;
}

function previewButton(container: HTMLElement): HTMLButtonElement | undefined {
  return Array.from(container.querySelectorAll("button")).find((b) =>
    /Preview/.test(b.textContent ?? ""),
  );
}

const fetchMock = jest.fn();
// Held as locals so the assertions below are typed mocks rather than `unknown`
// properties reached through globalThis.
const createObjectURL = jest.fn(() => "blob:mock-sample");
const revokeObjectURL = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  (globalThis as Record<string, unknown>).fetch = fetchMock;
  Object.defineProperty(URL, "createObjectURL", {
    value: createObjectURL,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    value: revokeObjectURL,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
});

describe("the Preview button", () => {
  test("renders on a PDF document card even with the gate off", () => {
    // Not a coin feature: the sample exists so a student can judge a resource
    // before spending anything, which includes the everything-is-free state.
    const container = render();
    expect(previewButton(container)).toBeDefined();
  });

  test("does not render for a non-PDF document — the button is absent rather than promising and failing", () => {
    const container = render({
      ...pdfResource,
      id: 813,
      file_name: "notes.docx",
      mime_type:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(previewButton(container)).toBeUndefined();
  });

  test("does not render for a video lecture — it already has a player", () => {
    const container = render({
      ...pdfResource,
      id: 814,
      resource_type: "video-lectures",
      file_name: "lecture.pdf",
    });
    expect(previewButton(container)).toBeUndefined();
  });
});

describe("the Preview modal", () => {
  test("opens on the fetched sample and closes, revoking the blob URL", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["%PDF-1.4 mock"]),
    });
    const container = render();

    await act(async () => {
      previewButton(container)!.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/api/v1/study-resources/812/preview",
    );
    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).not.toBeNull();
    expect(dialog!.querySelector("iframe")?.getAttribute("src")).toBe(
      "blob:mock-sample",
    );
    // The sample is framed as a sample: never mistaken for the document.
    expect(dialog!.textContent).toContain("First pages only");

    const closeButton = Array.from(dialog!.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label") === "Close preview",
    )!;
    await act(async () => {
      closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(document.querySelector("[role='dialog']")).toBeNull();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-sample");
  });

  test("a too-short document is told, not retried", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        success: false,
        code: "PREVIEW_UNAVAILABLE",
        message: "This document is too short to sample. Unlock it to read the whole thing.",
      }),
    });
    const container = render();

    await act(async () => {
      previewButton(container)!.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    const dialog = document.querySelector("[role='dialog']")!;
    expect(dialog.textContent).toContain("too short to sample");
    // No retry offer: the answer will be the same next time.
    expect(dialog.textContent).not.toContain("Try again");
  });

  test("a dropped network is the retryable state", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const container = render();

    await act(async () => {
      previewButton(container)!.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    const dialog = document.querySelector("[role='dialog']")!;
    expect(dialog.textContent).toContain("Could not load the preview");
    expect(dialog.textContent).toContain("Try again");
  });

  test("a closed preview mounts no dialog, so an ungated card still opens none", () => {
    // The coin inertness contract counts [role='dialog'] nodes; the preview
    // modal only exists while open.
    render();
    expect(document.querySelector("[role='dialog']")).toBeNull();
  });
});
