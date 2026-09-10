import { apiRequest } from "../services/api";

const originalWindow = (global as Record<string, unknown>).window;
const originalFetch = global.fetch;
const savedLocalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  "localStorage",
);

function setupBrowser() {
  (global as Record<string, unknown>).window = {};
  // Return a non-null token for every key so each request performs exactly
  // one getItem lookup — the first key probed is the sniffed key.
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: (key: string): string | null => `token-for-${key}` },
  });
  global.fetch = jest.fn(async () =>
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  ) as unknown as typeof fetch;
}

afterEach(() => {
  (global as Record<string, unknown>).window = originalWindow;
  global.fetch = originalFetch;
  if (savedLocalStorage) {
    Object.defineProperty(globalThis, "localStorage", savedLocalStorage);
  } else {
    delete (globalThis as Record<string, unknown>).localStorage;
  }
  jest.restoreAllMocks();
});

describe("apiRequest token sniffing", () => {
  test("institution paths use the institutionToken key first", async () => {
    setupBrowser();
    const getItem = jest.spyOn(
      (globalThis as { localStorage: { getItem: (key: string) => string | null } }).localStorage,
      "getItem",
    );
    // Singular prefix…
    await apiRequest("/api/v1/institution/dashboard");
    expect(getItem.mock.calls[0][0]).toBe("institutionToken");
    // …and the plural variant used by authenticated institution endpoints
    // (e.g. /api/v1/institutions/preferences), which the strict
    // "/api/v1/institution/" prefix would miss.
    await apiRequest("/api/v1/institutions/preferences");
    expect(getItem.mock.calls[1][0]).toBe("institutionToken");
  });

  test("provider, superadmin and default paths keep their existing keys", async () => {
    setupBrowser();
    const getItem = jest.spyOn(
      (globalThis as { localStorage: { getItem: (key: string) => string | null } }).localStorage,
      "getItem",
    );
    await apiRequest("/api/v1/scholarship-providers/scholarships");
    expect(getItem.mock.calls[0][0]).toBe("scholarshipProviderToken");
    await apiRequest("/api/v1/superadmin/stats");
    expect(getItem.mock.calls[1][0]).toBe("superadmin_token");
    await apiRequest("/api/v1/notifications");
    expect(getItem.mock.calls[2][0]).toBe("token");
  });

  test("shared inbox endpoints fall back to role tokens when the default key is absent", async () => {
    (global as Record<string, unknown>).window = {};
    const store: Record<string, string | null> = {
      token: null,
      institutionToken: "inst-token",
    };
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: (key: string): string | null => store[key] ?? null },
    });
    global.fetch = jest.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch;

    await apiRequest("/api/v1/notifications?limit=20");
    const [, options] = (global.fetch as jest.Mock).mock.calls[0] as [
      string,
      { headers: Record<string, string> },
    ];
    // Same hook, institution role: the institutionToken carries the request.
    expect(options.headers.Authorization).toBe("Bearer inst-token");
  });
});

describe("apiRequest 401 handling (superadmin redirect-to-landing regression)", () => {
  function setup401(
    store: Record<string, string | null>,
    status = 401,
  ): jest.Mock {
    const dispatchEvent = jest.fn();
    (global as Record<string, unknown>).window = { dispatchEvent };
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: (key: string): string | null => store[key] ?? null },
    });
    global.fetch = jest.fn(async () =>
      new Response(JSON.stringify({ message: "Unauthorized" }), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch;
    return dispatchEvent;
  }

  test("explicit authToken wins verbatim over stored keys (superadmin escape hatch)", async () => {
    setup401({ token: "stale-user-token", superadmin_token: "good-superadmin" });
    await apiRequest("/api/v1/notifications?limit=20", {
      authToken: "good-superadmin",
      suppressAuthExpired: true,
    }).catch(() => {});
    const [, options] = (global.fetch as jest.Mock).mock.calls[0] as [
      string,
      { headers: Record<string, string> },
    ];
    expect(options.headers.Authorization).toBe("Bearer good-superadmin");
  });

  test("401 on a user-token request still dispatches auth-expired", async () => {
    const dispatchEvent = setup401({ token: "user-token" });
    await expect(apiRequest("/api/v1/notifications")).rejects.toThrow();
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
  });

  test("401 on a role-token (superadmin fallback) request does NOT dispatch auth-expired", async () => {
    const dispatchEvent = setup401({
      token: null,
      superadmin_token: "good-superadmin",
    });
    await expect(apiRequest("/api/v1/notifications")).rejects.toThrow();
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  test("401 with an explicit token matching a stored role token does NOT dispatch auth-expired", async () => {
    const dispatchEvent = setup401({
      token: "user-token",
      superadmin_token: "good-superadmin",
    });
    await expect(
      apiRequest("/api/v1/admin/inquiries", { authToken: "good-superadmin" }),
    ).rejects.toThrow();
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  test("thrown request errors carry the HTTP status", async () => {
    setup401({ token: "user-token" });
    const err = await apiRequest("/api/v1/notifications").catch((e) => e);
    expect((err as { status?: number }).status).toBe(401);
  });
});
