const USER_STORAGE_KEY = "studsphere_user";
const TOKEN_STORAGE_KEY = "token";
const AUTH_STORAGE_KEY = "studsphere_auth";
const SCHOLARSHIP_PROVIDER_USER_KEY = "scholarshipProviderUser";
const SCHOLARSHIP_PROVIDER_TOKEN_KEY = "scholarshipProviderToken";
const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

function persistAuthSession(storage, user, token) {
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  storage.setItem(TOKEN_STORAGE_KEY, token);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
}

function clearAuthSession(storage) {
  storage.removeItem(USER_STORAGE_KEY);
  storage.removeItem(TOKEN_STORAGE_KEY);
  storage.removeItem(AUTH_STORAGE_KEY);
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
}

module.exports = {
  USER_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  AUTH_STORAGE_KEY,
  SCHOLARSHIP_PROVIDER_USER_KEY,
  SCHOLARSHIP_PROVIDER_TOKEN_KEY,
  ONBOARDING_COMPLETED_KEY,
  persistAuthSession,
  clearAuthSession,
  clearAllAuthSessions,
};
