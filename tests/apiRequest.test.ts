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
});
