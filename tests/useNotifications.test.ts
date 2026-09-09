/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { useNotifications } from "../features/notifications/useNotifications";
import { apiRequest } from "../services/api";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedApiRequest = apiRequest as jest.Mock;

const mountedRoots: Array<() => void> = [];

function renderHook<T>(useHook: () => T) {
  const result: { current: T } = { current: undefined as unknown as T };
  const container = document.createElement("div");
  const root = createRoot(container);
  function Probe() {
    result.current = useHook();
    return null;
  }
  act(() => {
    root.render(React.createElement(Probe));
  });
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    act(() => {
      root.unmount();
    });
  };
  mountedRoots.push(dispose);
  return {
    result,
    unmount: dispose,
  };
}

afterEach(() => {
  while (mountedRoots.length) mountedRoots.pop()!();
});

function makeRaw(id: number) {
  return {
    id,
    event_key: "account.welcome",
    category: "account",
    priority: "normal",
    title: `Title ${id}`,
    body: `Body ${id}`,
    link: "",
    read_at: null,
    created_at: "2026-09-08T09:00:00Z",
    updated_at: "2026-09-08T09:00:00Z",
  };
}

let listCalls = 0;

function countUnreadCalls() {
  return mockedApiRequest.mock.calls.filter((call) =>
    String(call[0]).includes("/unread-count"),
  ).length;
}

beforeEach(() => {
  jest.useFakeTimers();
  listCalls = 0;
  mockedApiRequest.mockReset();
  mockedApiRequest.mockImplementation((path: string) => {
    if (path.includes("/unread-count")) {
      return Promise.resolve({ data: { unread_count: 2 }, message: "ok" });
    }
    if (path.includes("/notifications?")) {
      listCalls += 1;
    }
    return Promise.resolve({
      data: {
        notifications: [makeRaw(1), makeRaw(2)],
        unread_count: 2,
        meta: { total: 2, page: 1, limit: 20 },
      },
      message: "ok",
    });
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useNotifications", () => {
  test("starts loading, then exposes items and unread count from the inbox API", async () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.loading).toBe(true);
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.items.map((n) => n.id)).toEqual([1, 2]);
    expect(result.current.unreadCount).toBe(2);
  });

  test("polls only the unread count every 60 seconds", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    const listCallsAfterMount = listCalls;
    const unreadCallsAfterMount = countUnreadCalls();

    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });

    expect(countUnreadCalls()).toBe(unreadCallsAfterMount + 2);
    expect(listCalls).toBe(listCallsAfterMount);
    expect(result.current.items.map((n) => n.id)).toEqual([1, 2]);
  });

  test("refreshes the list when the document becomes visible again", async () => {
    renderHook(() => useNotifications());
    await act(async () => {});
    const listCallsAfterMount = listCalls;

    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(listCalls).toBe(listCallsAfterMount + 1);
  });

  test("markRead PUTs :id/read, marks the item, and decrements the badge", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => {
      await result.current.markRead(1);
    });

    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/1/read", {
      method: "PUT",
    });
    expect(result.current.items[0].read_at).not.toBeNull();
    expect(result.current.unreadCount).toBe(1);
  });

  test("markAllRead PUTs read-all, marks every item, and zeroes the badge", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => {
      await result.current.markAllRead();
    });

    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/read-all", {
      method: "PUT",
    });
    expect(result.current.items.every((n) => n.read_at !== null)).toBe(true);
    expect(result.current.unreadCount).toBe(0);
  });

  test("setArchived PUTs archive and refreshes the list", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    const listCallsAfterMount = listCalls;

    await act(async () => {
      await result.current.setArchived(1, true);
    });

    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/1/archive", {
      method: "PUT",
    });
    expect(listCalls).toBe(listCallsAfterMount + 1);
  });

  test("remove DELETEs the item and drops it from the list", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => {
      await result.current.remove(2);
    });

    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/2", {
      method: "DELETE",
    });
    expect(result.current.items.map((n) => n.id)).toEqual([1]);
    expect(result.current.unreadCount).toBe(1);
  });

  test("unmount clears the poll interval and the visibility listener", async () => {
    const { unmount } = renderHook(() => useNotifications());
    await act(async () => {});
    const callsAtUnmount = mockedApiRequest.mock.calls.length;

    unmount();
    await act(async () => {
      jest.advanceTimersByTime(120_000);
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(mockedApiRequest.mock.calls.length).toBe(callsAtUnmount);
  });

  test("surfaces API errors without throwing", async () => {
    mockedApiRequest.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expect(result.current.error).toBe("boom");
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual([]);
  });
});
