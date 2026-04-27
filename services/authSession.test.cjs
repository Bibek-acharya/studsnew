const test = require("node:test");
const assert = require("node:assert/strict");

const { persistAuthSession, clearAuthSession } = require("./authSession");

test("persistAuthSession stores the user, token, and combined auth payload", () => {
  const storage = new Map();
  const mockStorage = {
    setItem(key, value) {
      storage.set(key, value);
    },
    getItem(key) {
      return storage.get(key) ?? null;
    },
    removeItem(key) {
      storage.delete(key);
    },
  };

  const user = { id: 7, email: "hello@example.com", role: "student" };
  persistAuthSession(mockStorage, user, "token-123");

  assert.equal(mockStorage.getItem("studsphere_user"), JSON.stringify(user));
  assert.equal(mockStorage.getItem("token"), "token-123");
  assert.equal(
    mockStorage.getItem("studsphere_auth"),
    JSON.stringify({ token: "token-123", user }),
  );
});

test("clearAuthSession removes every auth key used by the onboarding flow", () => {
  const storage = new Map([
    ["studsphere_user", "{}"],
    ["token", "token-123"],
    ["studsphere_auth", "{}"],
  ]);

  const mockStorage = {
    setItem(key, value) {
      storage.set(key, value);
    },
    getItem(key) {
      return storage.get(key) ?? null;
    },
    removeItem(key) {
      storage.delete(key);
    },
  };

  clearAuthSession(mockStorage);

  assert.equal(mockStorage.getItem("studsphere_user"), null);
  assert.equal(mockStorage.getItem("token"), null);
  assert.equal(mockStorage.getItem("studsphere_auth"), null);
});
