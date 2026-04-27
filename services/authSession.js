const USER_STORAGE_KEY = "studsphere_user";
const TOKEN_STORAGE_KEY = "token";
const AUTH_STORAGE_KEY = "studsphere_auth";

function persistAuthSession(storage, user, token) {
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  storage.setItem(TOKEN_STORAGE_KEY, token);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
}

function clearAuthSession(storage) {
  storage.removeItem(USER_STORAGE_KEY);
  storage.removeItem(TOKEN_STORAGE_KEY);
  storage.removeItem(AUTH_STORAGE_KEY);
}

module.exports = {
  USER_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  AUTH_STORAGE_KEY,
  persistAuthSession,
  clearAuthSession,
};
