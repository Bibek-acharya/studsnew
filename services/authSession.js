const USER_STORAGE_KEY = "studsphere_user";
const TOKEN_STORAGE_KEY = "token";
const AUTH_STORAGE_KEY = "studsphere_auth";
const SUPERADMIN_USER_KEY = "superadmin_user";
const SUPERADMIN_TOKEN_KEY = "superadmin_token";
const SUPERADMIN_AUTH_KEY = "superadmin_auth";
const SCHOLARSHIP_PROVIDER_USER_KEY = "scholarshipProviderUser";
const SCHOLARSHIP_PROVIDER_TOKEN_KEY = "scholarshipProviderToken";
const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

function clearCookie(name) {
  if (typeof window === "undefined") {
    return;
  }
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

function persistAuthSession(storage, user, token) {
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  storage.setItem(TOKEN_STORAGE_KEY, token);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));

  if (typeof document !== "undefined") {
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
  }
}

function clearAuthSession(storage) {
  storage.removeItem(USER_STORAGE_KEY);
  storage.removeItem(TOKEN_STORAGE_KEY);
  storage.removeItem(AUTH_STORAGE_KEY);
  storage.removeItem(SUPERADMIN_USER_KEY);
  storage.removeItem(SUPERADMIN_TOKEN_KEY);
  storage.removeItem(SUPERADMIN_AUTH_KEY);
  storage.removeItem(SCHOLARSHIP_PROVIDER_USER_KEY);
  storage.removeItem(SCHOLARSHIP_PROVIDER_TOKEN_KEY);
  storage.removeItem(ONBOARDING_COMPLETED_KEY);
}

function clearAllAuthSessions() {
  if (typeof window === "undefined") {
    return;
  }

  clearAuthSession(window.localStorage);
  clearAuthSession(window.sessionStorage);
  clearCookie("token");
  clearCookie("superadmin_token");
  clearCookie("scholarshipProviderToken");
}

module.exports = {
  USER_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  AUTH_STORAGE_KEY,
  SUPERADMIN_USER_KEY,
  SUPERADMIN_TOKEN_KEY,
  SUPERADMIN_AUTH_KEY,
  SCHOLARSHIP_PROVIDER_USER_KEY,
  SCHOLARSHIP_PROVIDER_TOKEN_KEY,
  ONBOARDING_COMPLETED_KEY,
  persistAuthSession,
  clearAuthSession,
  clearAllAuthSessions,
  clearCookie,
};
