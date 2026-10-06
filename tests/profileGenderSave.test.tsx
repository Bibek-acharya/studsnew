/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import ProfileSection from "@/components/user/dashboard/sections/ProfileSection";

/**
 * The reported bug: "I filled every field in my profile but it stops at 91% and
 * Gender is not being saved in the DB."
 *
 * 91% is exactly 11 of 12 checks (computeProfileCompletion scores gender as one
 * equal check), so the claim reduces to: the profile form's save does not carry
 * the picked gender. The backend was reproduced separately — PUT /api/v1/profile
 * with {"gender":"Male"} persists and echoes it — so the only remaining place the
 * value can be lost is THIS form's payload. That is what this test asserts
 * directly: pick a gender in edit mode, press Save Changes, and the request body
 * must contain it.
 */

const mockUpdateProfile = jest.fn();
const mockSavePreferences = jest.fn();

const loadedProfile = {
  id: 3,
  email: "student@example.com",
  first_name: "Ada",
  last_name: "Lovelace",
  middle_name: "",
  phone: "9800000000",
  alternate_phone: "",
  date_of_birth: "2005-01-01",
  gender: "", // the DB's state before the fix: never persisted
  nationality: "Nepali",
  address: JSON.stringify({ province: "Bagmati", district: "Kathmandu", localLevel: "" }),
  bio: "Hello",
  role: "student",
  google_id: null,
  image_url: "",
  preferences: {
    role: "student",
    preference_flow: "onboarding",
    preferences: { onboarding_completed: true },
    onboarding_completed: true,
  },
};

jest.mock("@/services/api", () => ({
  apiService: {
    getProfile: jest.fn(() =>
      Promise.resolve({ data: (globalThis as Record<string, unknown>).__profile }),
    ),
    updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
    getEducationEntries: jest.fn(() => Promise.resolve({ data: [] })),
    getDashboardStats: jest.fn(() =>
      Promise.resolve({ data: { profile_completion: 91 } }),
    ),
    savePreferences: (...args: unknown[]) => mockSavePreferences(...args),
    createEducationEntry: jest.fn(),
    updateEducationEntry: jest.fn(),
    deleteEducationEntry: jest.fn(),
    uploadProfilePicture: jest.fn(),
    getProfileDocuments: jest.fn(() => Promise.resolve({ data: [] })),
    uploadProfileDocument: jest.fn(),
    deleteProfileDocument: jest.fn(),
  },
  getImageUrl: (v: string) => v,
  stripHtml: (v: string) => v,
}));

jest.mock("@/services/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 3, first_name: "Ada", last_name: "Lovelace" },
    setUser: jest.fn(),
  }),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
(globalThis as Record<string, unknown>).__profile = loadedProfile;

beforeEach(() => {
  mockUpdateProfile.mockReset();
  mockSavePreferences.mockReset();
  mockUpdateProfile.mockResolvedValue({ data: loadedProfile });
  mockSavePreferences.mockResolvedValue({ data: {} });
});

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render(): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(<ProfileSection />);
  });
  return container;
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function button(container: HTMLElement, label: RegExp): HTMLButtonElement {
  const found = Array.from(container.querySelectorAll("button")).find((b) =>
    label.test(b.textContent ?? ""),
  );
  if (!found) throw new Error(`no button matching ${label}`);
  return found;
}

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
  delete (globalThis as Record<string, unknown>).__profile;
});

test("picking a gender in edit mode and saving sends it in the payload", async () => {
  const container = render();
  await flush();

  // Enter edit mode: the button is "Edit" first, then "Save Changes".
  await act(async () => {
    button(container, /Edit/).dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const selects = Array.from(container.querySelectorAll("select"));
  const genderSelect = selects.find((s) =>
    Array.from(s.options).map((o) => o.textContent).join(",") ===
    "Select gender,Male,Female,Other",
  );
  if (!genderSelect) {
    throw new Error(
      `no gender select found; page has ${selects.length} selects: ` +
        selects
          .map((s) => Array.from(s.options).map((o) => o.textContent).join("|"))
          .join(" / "),
    );
  }

  // The empty state must SAY it is empty. A box that looks answered is a field
  // nobody touches, and gender is the one check this profile is missing.
  expect(genderSelect.value).toBe("");
  expect(genderSelect.options[0].textContent).toBe("Select gender");
  expect(genderSelect.options[0].disabled).toBe(true);

  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      "value",
    )!.set!;
    setter.call(genderSelect, "Female");
    genderSelect.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await act(async () => {
    button(container, /Save Changes/).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
  });
  await flush();

  expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
  const payload = mockUpdateProfile.mock.calls[0][0] as Record<string, unknown>;
  expect(payload.gender).toBe("Female");
});

test("the loaded profile's existing gender survives a save without edits to it", async () => {
  (globalThis as Record<string, unknown>).__profile = { ...loadedProfile, gender: "Other" };
  const container = render();
  await flush();

  await act(async () => {
    button(container, /Edit/).dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await act(async () => {
    button(container, /Save Changes/).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
  });
  await flush();

  const payload = mockUpdateProfile.mock.calls[0][0] as Record<string, unknown>;
  expect(payload.gender).toBe("Other");
  expect(mockUpdateProfile.mock.calls[0][0]).toBeTruthy();
});