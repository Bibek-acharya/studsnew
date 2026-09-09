/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import NotificationList from "../components/notifications/NotificationList";
import type { NotificationItem } from "../features/notifications/types";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });
  containers.push(container);
  roots.push(root);
  return container;
}

afterEach(() => {
  while (roots.length) {
    const root = roots.pop()!;
    act(() => {
      root.unmount();
    });
  }
  while (containers.length) containers.pop()!.remove();
});

function item(overrides: Partial<NotificationItem>): NotificationItem {
  return {
    id: 1,
    event_key: "",
    category: "application",
    priority: "normal",
    title: "Title",
    body: "Body",
    link: "",
    read_at: null,
    created_at: new Date().toISOString(),
    data: null,
    ...overrides,
  };
}

describe("NotificationList", () => {
  test("derives category tabs from the item set and reports tab clicks", () => {
    const onCategoryChange = jest.fn();
    const container = render(
      <NotificationList
        items={[
          item({ id: 1, category: "application" }),
          item({ id: 2, category: "content" }),
          item({ id: 3, category: "application" }),
        ]}
        onMarkRead={jest.fn()}
        onCategoryChange={onCategoryChange}
      />,
    );

    const tablist = container.querySelector('[role="tablist"]')!;
    const tabs = Array.from(tablist.querySelectorAll("button")).map(
      (b) => b.textContent,
    );
    expect(tabs).toEqual(["All", "application", "content"]);
    expect(tabs.filter((t) => t === "application")).toHaveLength(1);

    const contentTab = Array.from(tablist.querySelectorAll("button")).find(
      (b) => b.textContent === "content",
    )!;
    act(() => {
      contentTab.click();
    });
    expect(onCategoryChange).toHaveBeenCalledWith("content");
  });

  test("filters items by the active category", () => {
    const container = render(
      <NotificationList
        items={[
          item({ id: 1, category: "application", title: "App item" }),
          item({ id: 2, category: "content", title: "Content item" }),
        ]}
        onMarkRead={jest.fn()}
        activeCategory="content"
      />,
    );
    expect(container.textContent).toContain("Content item");
    expect(container.textContent).not.toContain("App item");
  });

  test("groups items by day with Today/Yesterday/date headers", () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86_400_000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 86_400_000);
    const container = render(
      <NotificationList
        items={[
          item({ id: 1, created_at: now.toISOString(), title: "Today item" }),
          item({
            id: 2,
            created_at: yesterday.toISOString(),
            title: "Yesterday item",
          }),
          item({
            id: 3,
            created_at: threeDaysAgo.toISOString(),
            title: "Old item",
          }),
        ]}
        onMarkRead={jest.fn()}
      />,
    );
    const headers = Array.from(
      container.querySelectorAll("[data-day-header]"),
    ).map((h) => h.textContent);
    expect(headers).toHaveLength(3);
    expect(headers![0]).toBe("Today");
    expect(headers![1]).toBe("Yesterday");
    expect(headers![2]).not.toBe("Today");
    expect(headers![2]).not.toBe("Yesterday");
  });

  test("renders the loading skeleton instead of items", () => {
    const container = render(
      <NotificationList items={[]} loading onMarkRead={jest.fn()} />,
    );
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
    expect(container.textContent).not.toContain("Title");
  });

  test("shows the error with a working retry", () => {
    const onRetry = jest.fn();
    const container = render(
      <NotificationList
        items={[]}
        error="Could not load"
        onRetry={onRetry}
        onMarkRead={jest.fn()}
      />,
    );
    expect(container.textContent).toContain("Could not load");
    const retry = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent === "Retry",
    )!;
    act(() => {
      retry.click();
    });
    expect(onRetry).toHaveBeenCalled();
  });

  test("truly-empty inbox shows You're all caught up with no splash art", () => {
    const container = render(
      <NotificationList items={[]} onMarkRead={jest.fn()} />,
    );
    expect(container.textContent).toContain("You're all caught up");
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("svg").length).toBeLessThanOrEqual(1);
  });

  test("clicking an unread item marks it read; read items are inert", () => {
    const onMarkRead = jest.fn();
    const container = render(
      <NotificationList
        items={[
          item({ id: 1, read_at: null, title: "Unread item" }),
          item({ id: 2, read_at: new Date().toISOString(), title: "Read item" }),
        ]}
        onMarkRead={onMarkRead}
      />,
    );
    const buttons = Array.from(container.querySelectorAll("button")).filter(
      (b) => b.textContent?.includes("item"),
    );
    act(() => {
      buttons[0].click();
    });
    act(() => {
      buttons[1].click();
    });
    expect(onMarkRead).toHaveBeenCalledTimes(1);
    expect(onMarkRead).toHaveBeenCalledWith(1);
  });
});
