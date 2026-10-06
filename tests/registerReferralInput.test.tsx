/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import RegisterForm from "@/components/auth/RegisterForm";
import SignupView from "@/components/auth/SignupView";

/**
 * The reported gap: "I have nowhere to input a referral code while signing up,
 * neither via Google nor the form."
 *
 * The carriers existed for shared LINKS only — `?ref=` into localStorage — and
 * there was no field to type a code read off a screen. Worse, the Google button
 * parked nothing: GoogleCallback reads the code from a `referral_code` cookie
 * (`referralCodeFrom` in internal/auth/handler.go) and nothing in this app ever
 * set that cookie, so even a link-carried code vanished the moment a student
 * chose Google.
 *
 * These tests pin the three things that must hold now:
 *   1. a typed code reaches the register payload (normalised),
 *   2. a cleared/junk code means NO referral_code field, never a silent fallback
 *      to the stored invitation,
 *   3. pressing "Continue with Google" parks the code in the cookie the
 *      callback reads.
 */

const mockRegister = jest.fn();
const mockSendOTP = jest.fn();
const mockPersistInvite = jest.fn();
const mockClearInvite = jest.fn();

jest.mock("@/services/api", () => ({
  apiService: {
    register: (...args: unknown[]) => mockRegister(...args),
    sendOTP: (...args: unknown[]) => mockSendOTP(...args),
  },
}));

jest.mock("@/services/AuthContext", () => ({
  useAuth: () => ({
    verifyOTP: jest.fn(),
    register: (...args: unknown[]) => mockRegister(...args),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("@/lib/referralInvite", () => {
  const actual = jest.requireActual("@/lib/referralInvite");
  return {
    ...actual,
    persistReferralInvite: (...args: unknown[]) => mockPersistInvite(...args),
    clearReferralInvite: (...args: unknown[]) => mockClearInvite(...args),
    persistReferralCookie: actual.persistReferralCookie,
  };
});

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const VALID_CODE = "K7M2QX9RT4"; // 10 chars, Crockford alphabet

let cookieJar = "";

function readCookie(name: string): string | null {
  const hit = cookieJar
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

beforeEach(() => {
  mockRegister.mockReset();
  mockSendOTP.mockReset();
  mockPersistInvite.mockReset();
  mockClearInvite.mockReset();
  mockRegister.mockResolvedValue({});
  mockSendOTP.mockResolvedValue({});
  localStorage.clear();
  cookieJar = "";
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => cookieJar,
    set: (value: string) => {
      // jsdom never expires cookies, so max-age=0 is honoured by hand.
      if (/max-age=0/i.test(value)) {
        const name = value.split("=")[0].trim();
        cookieJar = cookieJar
          .split("; ")
          .filter((row) => row && !row.startsWith(`${name}=`))
          .join("; ");
        return;
      }
      cookieJar = cookieJar ? `${cookieJar}; ${value}` : value;
    },
  });
  window.history.replaceState({}, "", "/register");
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
    root.render(<RegisterForm />);
  });
  return container;
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function setInput(container: HTMLElement, selector: string, value: string) {
  const input = container.querySelector(selector) as HTMLInputElement | null;
  if (!input) throw new Error(`no input ${selector}`);
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function button(container: HTMLElement, label: RegExp): HTMLButtonElement {
  const found = Array.from(container.querySelectorAll("button")).find((b) =>
    label.test(b.textContent ?? ""),
  );
  if (!found) throw new Error(`no button matching ${label}`);
  return found;
}

async function fillDetailsAndSubmit(container: HTMLElement) {
  // Step 1 → details: email + terms. The referral input is NOT cleared here:
  // a link-seeded code must survive into the payload untouched, which is
  // exactly what the seeded test asserts.
  const email = container.querySelector('input[type="email"]') as HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )!.set!;
  act(() => {
    setter.call(email, "newbie@example.com");
    email.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const terms = container.querySelector("#terms") as HTMLInputElement;
  await act(async () => {
    // A real click, not checked+change: React drives checkbox onChange off the
    // click event, so the synthetic change alone would leave state untouched.
    terms.click();
  });
  await act(async () => {
    // Anchored: "Continue with Google" also matches a loose /Continue/.
    button(container, /^Continue$/).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
  });

  setInput(container, 'input[placeholder="Enter first name"]', "New");
  setInput(container, 'input[placeholder="Enter last name"]', "Student");
  setInput(container, 'input[placeholder="Enter password"]', "Password1!");
  setInput(container, 'input[placeholder="Confirm password"]', "Password1!");

  await act(async () => {
    button(container, /Verify Account/).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
  });
  await flush();
}

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
  window.history.replaceState({}, "", "/");
});

test("a typed referral code reaches the register payload, normalised", async () => {
  const container = render();
  await flush();

  // Typed the way a human reads it off a screen: lowercase, a stray space.
  setInput(container, "#referral-code", ` ${VALID_CODE.toLowerCase()} `);
  await fillDetailsAndSubmit(container);

  expect(mockRegister).toHaveBeenCalledTimes(1);
  const payload = mockRegister.mock.calls[0][0] as Record<string, unknown>;
  expect(payload.referral_code).toBe(VALID_CODE);
});

test("junk in the field sends NO code rather than falling back to a stored one", async () => {
  const container = render();
  await flush();

  // Pure punctuation: the normaliser drops everything outside the alphabet, so
  // this is input that cannot be a code under ANY reading of it. (Letters alone
  // would survive normalisation — the server stages those harmlessly and an
  // unknown code attributes nothing — so the honest test of "no fallback" is
  // input that normalises to nothing.)
  setInput(container, "#referral-code", "###???");
  await fillDetailsAndSubmit(container);

  const payload = mockRegister.mock.calls[0][0] as Record<string, unknown>;
  // Falling back to localStorage here would credit a friend the student never
  // named — the exact silent-substitution the invite lib exists to prevent.
  expect(payload.referral_code).toBeUndefined();
});

test("no code anywhere means no referral_code field at all", async () => {
  const container = render();
  await flush();
  await fillDetailsAndSubmit(container);

  const payload = mockRegister.mock.calls[0][0] as Record<string, unknown>;
  expect(payload.referral_code).toBeUndefined();
});

test("a link-arrived code is seeded into the field and survives untouched", async () => {
  window.history.replaceState({}, "", `/register?ref=${VALID_CODE}`);
  const container = render();
  await flush();

  const input = container.querySelector(
    "#referral-code",
  ) as HTMLInputElement;
  expect(input.value).toBe(VALID_CODE);

  await fillDetailsAndSubmit(container);
  const payload = mockRegister.mock.calls[0][0] as Record<string, unknown>;
  expect(payload.referral_code).toBe(VALID_CODE);
});

test("Continue with Google parks the code in the cookie the callback reads", async () => {
  const container = render();
  await flush();

  setInput(container, "#referral-code", VALID_CODE);
  await act(async () => {
    button(container, /Continue with Google/).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
  });

  // GoogleCallback → referralCodeFrom(c) reads exactly this cookie name.
  expect(readCookie("referral_code")).toBe(VALID_CODE);
  // …and it is also remembered for a later email signup.
  expect(mockPersistInvite).toHaveBeenCalledWith(VALID_CODE);
});

/**
 * The SECOND signup surface: the scholarship finder's AuthModal. Its register
 * path went through `AuthContext.register`, which took no referral parameter at
 * all — so a code could not reach that signup even in principle, and its Google
 * button parked nothing either. Both are pinned here so the two surfaces cannot
 * drift apart again.
 */
describe("the signup modal (scholarship finder)", () => {
  function renderModal(): HTMLElement {
    const container = document.createElement("div");
    document.body.appendChild(container);
    containers.push(container);
    const root = createRoot(container);
    roots.push(root);
    act(() => {
      root.render(
        <SignupView
          onSwitch={() => {}}
          onSuccess={() => {}}
          onOTPRequired={() => {}}
        />,
      );
    });
    return container;
  }

  async function fillModal(container: HTMLElement) {
    setInput(container, 'input[name="fullName"]', "New Student");
    setInput(container, 'input[name="email"]', "modal@example.com");
    setInput(container, 'input[name="phone"]', "9800000000");
    setInput(container, 'input[name="password"]', "Password1!");
    setInput(container, 'input[name="confirmPassword"]', "Password1!");
    const terms = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    await act(async () => {
      terms.click();
    });
    await act(async () => {
      // Submit via the form event: React's onSubmit listens on the form, and a
      // dispatched submit event is exactly what jsdom's button click would do.
      container
        .querySelector("form")!
        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    await flush();
  }

  test("a stored invite code shows in the field and rides the register call", async () => {
    localStorage.setItem("studsphere.referralInvite", VALID_CODE);
    const container = renderModal();
    await flush();

    const input = container.querySelector(
      "#modal-referral-code",
    ) as HTMLInputElement;
    expect(input.value).toBe(VALID_CODE);

    await fillModal(container);

    expect(mockRegister).toHaveBeenCalledTimes(1);
    const args = mockRegister.mock.calls[0];
    // The 7th parameter is the new referralCode argument.
    expect(args[6]).toBe(VALID_CODE);
  });

  test("no invite anywhere means no code is passed", async () => {
    const container = renderModal();
    await flush();
    await fillModal(container);

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister.mock.calls[0][6]).toBeUndefined();
  });

  test("the modal's Google button parks the cookie the callback reads", async () => {
    const container = renderModal();
    await flush();

    setInput(container, "#modal-referral-code", VALID_CODE);
    await act(async () => {
      button(container, /Google/).dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    expect(readCookie("referral_code")).toBe(VALID_CODE);
    expect(mockPersistInvite).toHaveBeenCalledWith(VALID_CODE);
  });
});