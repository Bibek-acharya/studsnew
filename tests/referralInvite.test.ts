/**
 * Getting the code from the link to the signup request.
 *
 * @jest-environment jsdom
 *
 * The rule under test is not "does it store a string" — it is the precedence
 * between the two carriers, and specifically the one case where being helpful
 * would be a small act of dishonesty: a `ref` that cannot be a code must NOT fall
 * back to whatever is left in storage from a previous visit.
 */
import {
  clearReferralInvite,
  persistReferralInvite,
  readStoredReferralInvite,
  resolveReferralInvite,
} from "@/lib/referralInvite";

const CODE = "7K2M9Q4XTB";

beforeEach(() => {
  window.localStorage.clear();
});

describe("a code in the link wins", () => {
  test("a usable ref is normalised and returned in canonical form", () => {
    expect(resolveReferralInvite(CODE.toLowerCase())).toEqual({
      code: CODE,
      source: "link",
    });
  });

  test("deciding is pure, so it is safe to call during a render", () => {
    // `resolveReferralInvite` must not write. React may render a component more
    // than once, so a function that persists on every call is a function that
    // cannot be called during rendering — which is why the snapshot in
    // `RegisterForm` is built from it. The write is `persistReferralInvite`, in
    // its own effect.
    resolveReferralInvite(CODE);
    expect(readStoredReferralInvite()).toBeNull();
  });

  test("the write is the separate, explicit step", () => {
    // The two carriers both being populated, and agreeing, is the property the
    // split exists to keep.
    const { code } = resolveReferralInvite(CODE.toLowerCase());
    expect(persistReferralInvite(code)).toBe(CODE);
    expect(readStoredReferralInvite()).toBe(CODE);
  });

  test("a ref is normalised the same way the server normalises it", () => {
    // `O` for `0` in a shared link, typed by a friend on a phone.
    expect(resolveReferralInvite("ok2m9q4xtb").code).toBe("0K2M9Q4XTB");
    expect(resolveReferralInvite("7K2M 9Q4XTB").code).toBe(CODE);
  });
});

describe("a broken link does not stop the signup", () => {
  test("an unusable ref is reported as such, and nothing is sent", () => {
    const invite = resolveReferralInvite("this-link-is-broken");
    expect(invite.code).toBeNull();
    // The distinction the form renders on: silence would be indistinguishable
    // from never having followed an invite.
    expect(invite.source).toBe("invalid-link");
  });

  test("a broken ref does NOT fall back to a stored code", () => {
    // The case the whole precedence rule exists for. A student who clicked a
    // mangled link after being invited properly last week must not be silently
    // credited to that older invite: the friend who earned it would be paid for
    // somebody they never sent, and the attribution would be wrong forever.
    //
    // "not-a-code" is the fixture rather than arbitrary words on purpose — see
    // the "arbitrary junk" test below for why the choice of junk matters.
    persistReferralInvite(CODE);
    expect(readStoredReferralInvite()).toBe(CODE);

    const invite = resolveReferralInvite("not-a-code");
    expect(invite.code).toBeNull();
    expect(invite.source).toBe("invalid-link");

    // The stored code is left intact rather than destroyed — this decision is
    // about what THIS registration carries, not about deleting a student's data.
    expect(readStoredStillIntact()).toBe(CODE);
  });

  test("a ref of the wrong length is unusable", () => {
    expect(resolveReferralInvite("7K2M9Q4XT").source).toBe("invalid-link");
    expect(resolveReferralInvite(`${CODE}9`).source).toBe("invalid-link");
  });

  /**
   * The limit of what this client is allowed to know, pinned as a test because it
   * looks like a bug and is not.
   *
   * Normalisation is a filter, not a validator: "broken-link" reduces to
   * `BR0KEN11NK`, which is ten legal alphabet characters, so it is a well-formed
   * code as far as this client can tell. It is sent to the server, matches
   * nothing, and attributes nothing — silently, and correctly.
   *
   * This is not a gap that could be closed. `03-api-contract.md` §2.5 is
   * explicit that there is deliberately no way to ask whether a code exists, so
   * that the endpoint cannot be used as an oracle for testing codes. The client
   * can only detect a link that cannot BE a code; it can never detect a code that
   * is not a real one, and no copy may imply otherwise.
   */
  test("arbitrary junk that normalises to ten legal characters is treated as a code", () => {
    const invite = resolveReferralInvite("broken-link");
    expect(invite.code).toBe("BR0KEN11NK");
    expect(invite.source).toBe("link");
  });
});

describe("no ref means the stored code, and nothing means nothing", () => {
  test("with no ref and a stored code, the stored code is used", () => {
    persistReferralInvite(CODE);
    expect(resolveReferralInvite(null)).toEqual({ code: CODE, source: "storage" });
    expect(resolveReferralInvite(undefined)).toEqual({ code: CODE, source: "storage" });
    // An empty or whitespace param is the absence of a param, not a broken link.
    expect(resolveReferralInvite("")).toEqual({ code: CODE, source: "storage" });
    expect(resolveReferralInvite("   ")).toEqual({ code: CODE, source: "storage" });
  });

  test("with neither, there is no code and no complaint", () => {
    expect(resolveReferralInvite(null)).toEqual({ code: null, source: "none" });
  });

  test("a stored code that is no longer usable is treated as none", () => {
    // Storage is writable from the devtools; a mangled value must not be sent.
    window.localStorage.setItem("studsphere.referralInvite", "junk");
    expect(resolveReferralInvite(null)).toEqual({ code: null, source: "none" });
  });
});

describe("the code is cleared once it has been used", () => {
  test("clear removes it, and clearing twice is safe", () => {
    persistReferralInvite(CODE);
    expect(readStoredReferralInvite()).toBe(CODE);
    clearReferralInvite();
    expect(readStoredReferralInvite()).toBeNull();
    clearReferralInvite();
    expect(readStoredReferralInvite()).toBeNull();
  });

  test("after clearing, a bare /register carries nothing", () => {
    persistReferralInvite(CODE);
    clearReferralInvite();
    expect(resolveReferralInvite(null).source).toBe("none");
  });
});

describe("storage that refuses is not a signup failure", () => {
  test("a write that throws returns null rather than propagating", () => {
    const setItem = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
    // Safari private mode throws on write. The URL carrier is still in place, so
    // the worst case is a lost fallback — never a broken form.
    expect(persistReferralInvite(CODE)).toBeNull();
    setItem.mockRestore();
  });

  test("a read that throws is treated as nothing stored", () => {
    const getItem = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("SecurityError");
      });
    expect(readStoredReferralInvite()).toBeNull();
    expect(resolveReferralInvite(null)).toEqual({ code: null, source: "none" });
    getItem.mockRestore();
  });
});

/** Read the raw key, bypassing the normaliser, to prove it was not deleted. */
function readStoredStillIntact(): string | null {
  return window.localStorage.getItem("studsphere.referralInvite");
}
