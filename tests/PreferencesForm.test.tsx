/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import PreferencesForm from "../features/notifications/PreferencesForm";
import { notificationClient } from "../services/notificationClient";

jest.mock("../services/notificationClient", () => ({
  notificationClient: {
    fetchPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedClient = notificationClient as unknown as {
  fetchPreferences: jest.Mock;
  updatePreferences: jest.Mock;
};

const PREFS = {
  data: {
    groups: [
      { key: "application", label: "Application updates", in_app: true, email: true, overridden: false },
      { key: "scholarship", label: "Scholarship alerts", in_app: true, email: true, overridden: false },
    ],
    global: {},
  },
  message: "ok",
};

let container: HTMLDivElement;
let root: Root | null = null;

function render() {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root!.render(<PreferencesForm />);
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedClient.fetchPreferences.mockResolvedValue(PREFS);
  mockedClient.updatePreferences.mockImplementation((payload: unknown) =>
    Promise.resolve({ data: PREFS.data, message: "ok", payload }),
  );
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  container.remove();
  root = null;
});

function checkbox(label: string): HTMLInputElement {
  const el = container.querySelector(`input[aria-label="${label}"]`);
  if (!el) throw new Error(`checkbox not found: ${label}`);
  return el as HTMLInputElement;
}

describe("PreferencesForm", () => {
  test("groups render from the GET /preferences response", async () => {
    render();
    await act(async () => {});
    expect(mockedClient.fetchPreferences).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("Application updates");
    expect(container.textContent).toContain("Scholarship alerts");
    expect(checkbox("Application updates email").checked).toBe(true);
  });

  test("toggling a group saves a sparse PUT override body", async () => {
    render();
    await act(async () => {});
    await act(async () => {
      checkbox("Application updates email").click();
    });
    expect(mockedClient.updatePreferences).toHaveBeenCalledTimes(1);
    expect(mockedClient.updatePreferences).toHaveBeenCalledWith({
      overrides: [{ pref_key: "application", email: false }],
    });
  });

  test("global row edits PUT the sparse global body", async () => {
    render();
    await act(async () => {});
    await act(async () => {
      checkbox("All notifications email").click();
    });
    expect(mockedClient.updatePreferences).toHaveBeenCalledWith({
      overrides: [],
      global: { email: false },
    });
  });
});
