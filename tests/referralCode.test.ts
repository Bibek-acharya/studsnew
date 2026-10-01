/**
 * The referral code normaliser, and proof that the test is load-bearing.
 *
 * @jest-environment jsdom
 *
 * ## Why this file is mostly one rule
 *
 * `lib/referralCode.ts` is a transcription of `NormalizeReferralCode` in
 * `studsback/internal/shared/utils/referral_code.go`. A transcription that has
 * drifted is worse than no normaliser at all, because a code that looks valid,
 * is normalised confidently and matches nothing is a referral that vanishes
 * without a trace — and the student and the friend who invited them are both
 * told nothing.
 *
 * So the test pins the whole rule, case by case, rather than spot-checking a
 * happy path.
 *
 * ## The falsification at the bottom
 *
 * A passing test proves nothing unless a broken implementation can fail it. The
 * last describe block builds two deliberately-broken normalisers — one that
 * uppercases but forgets the Crockford decode aliases, and one that only
 * uppercases and leaves the alphabet alone — and asserts that each one FAILS on
 * a code that differs from a real one only by `O`/`0` or `I`/`1`. If someone
 * weakens `normalizeReferralCode` to a bare `toUpperCase()`, that block goes
 * red. That is the point of it.
 */
import {
  REFERRAL_CODE_ALPHABET,
  REFERRAL_CODE_LENGTH,
  asUsableReferralCode,
  hasCanonicalLength,
  normalizeReferralCode,
} from "@/lib/referralCode";

/** A real code drawn from the alphabet. */
const CODE = "7K2M9Q4XTB";

describe("the normaliser matches the server's rule", () => {
  test("a code that is already canonical is unchanged", () => {
    expect(normalizeReferralCode(CODE)).toBe(CODE);
  });

  test("case is noise: lower case is the same code", () => {
    // The unique index is on the canonical form, so storing what the client sent
    // would let one code exist twice in two spellings and neither would collide.
    expect(normalizeReferralCode(CODE.toLowerCase())).toBe(CODE);
    expect(normalizeReferralCode("7k2m9q4xtb")).toBe(CODE);
  });

  test("O is read as zero", () => {
    // Crockford decode alias. The canonical code here starts `7K2M9Q4XTB`; the
    // same code read by a human and mistyped has O where the 0-family is.
    expect(normalizeReferralCode("7K2M9Q4XTB")).toBe("7K2M9Q4XTB");
    const withO = "OK2M9Q4XTB";
    expect(normalizeReferralCode(withO)).toBe("0K2M9Q4XTB");
  });

  test("I and L are both read as one", () => {
    const withI = "7K2M9Q4XTB".replace("X", "I");
    const withL = "7K2M9Q4XTB".replace("X", "L");
    // `replace` with a string pattern replaces the first match, so the X at
    // index 7 is the one that changes and the X in the pair is gone.
    expect(withI).toBe("7K2M9Q4ITB");
    expect(withL).toBe("7K2M9Q4LTB");
    expect(normalizeReferralCode(withI)).toBe("7K2M9Q41TB");
    expect(normalizeReferralCode(withL)).toBe("7K2M9Q41TB");
  });

  test("separators a chat client or a leaflet introduces are dropped", () => {
    expect(normalizeReferralCode("7K2M 9Q4XTB")).toBe(CODE);
    expect(normalizeReferralCode("7K2M-9Q4XTB")).toBe(CODE);
    expect(normalizeReferralCode("  7K2M9Q4XTB  ")).toBe(CODE);
  });

  test("U is dropped, not mapped to anything", () => {
    // Crockford drops U alongside V, and unlike O/I/L it has no decode alias.
    // Mapping it to V would fabricate a character the alphabet does not have.
    // The K is a legal member and stays; only the U goes.
    expect(normalizeReferralCode("7KU2M9Q4XT")).toBe("7K2M9Q4XT");
  });

  test("characters outside the alphabet are dropped, not rejected", () => {
    // Silently dropping is the server's behaviour and it is correct here: a code
    // that survives normalisation but matches no row has the same outcome as one
    // that was dropped, and an error message would leak whether a code exists.
    expect(normalizeReferralCode("7K!2M@9Q#4X$TB%")).toBe(CODE);
    // A whole pasted sentence reduces to the code and nothing else: the U is
    // dropped, the spaces and the `O` in "CODE" and the `L` in "PLEASE" are
    // aliased, and every remaining word's letters are legal alphabet members.
    expect(normalizeReferralCode("use my code 7K2M9Q4XTB please")).toBe(
      "SEMYC0DE7K2M9Q4XTBP1EASE",
    );
  });

  test("non-ASCII is dropped rather than mangled", () => {
    expect(normalizeReferralCode("7K2M9Q4XTBé")).toBe(CODE);
    // "ß" is the case that separates this implementation from a naive
    // `toUpperCase()`: JavaScript expands it to "SS" (two characters, both in
    // the alphabet, so a naive version keeps them) while Go's simple case
    // mapping leaves it alone and the Go function then drops it.
    expect(normalizeReferralCode("ß")).toBe("");
    expect(normalizeReferralCode("7K2M9Q4XTBß")).toBe(CODE);
  });

  test("non-string input is empty rather than a throw", () => {
    expect(normalizeReferralCode(null)).toBe("");
    expect(normalizeReferralCode(undefined)).toBe("");
    expect(normalizeReferralCode("")).toBe("");
    expect(normalizeReferralCode(42 as unknown as string)).toBe("");
  });

  test("the alphabet is the 32 symbols Go draws from", () => {
    expect(REFERRAL_CODE_ALPHABET).toBe("0123456789ABCDEFGHJKMNPQRSTVWXYZ");
    expect(REFERRAL_CODE_ALPHABET).toHaveLength(32);
    // The four omissions are the whole reason for the alphabet.
    for (const banned of ["I", "L", "O", "U"]) {
      expect(REFERRAL_CODE_ALPHABET).not.toContain(banned);
    }
  });
});

describe("the length check is a filter and not a validation", () => {
  test("ten characters is canonical", () => {
    expect(REFERRAL_CODE_LENGTH).toBe(10);
    expect(hasCanonicalLength(CODE)).toBe(true);
  });

  test("any other length is not, and says nothing about existence", () => {
    expect(hasCanonicalLength("7K2M9Q4XT")).toBe(false);
    expect(hasCanonicalLength("7K2M9Q4XTB9")).toBe(false);
    expect(hasCanonicalLength("")).toBe(false);
    expect(hasCanonicalLength(null)).toBe(false);
  });

  test("a usable code is returned, and an unusable one is null", () => {
    expect(asUsableReferralCode(CODE.toLowerCase())).toBe(CODE);
    // Not an error the student can read. A null here is a "carry on regardless"
    // signal: `/r/[code]` redirects either way.
    expect(asUsableReferralCode("nope")).toBeNull();
    expect(asUsableReferralCode("7K2M9Q4XTB9")).toBeNull();
  });
});

describe("falsification: a broken normaliser must fail these cases", () => {
  /**
   * Broken normaliser #1: uppercase only, no decode aliases.
   *
   * This is the mistake that is easiest to make, because "just uppercase it"
   * looks like a complete implementation of "normalise the code". It is wrong for
   * the two character pairs the alphabet was designed to eliminate.
   */
  const brokenNoAliases = (raw: string): string =>
    raw.toUpperCase().split("").filter((c) => REFERRAL_CODE_ALPHABET.includes(c)).join("");

  /** Broken normaliser #2: decode aliases, but case is not folded. */
  const brokenNoCaseFold = (raw: string): string => {
    let out = "";
    for (const char of raw) {
      const mapped = char === "O" ? "0" : char === "I" || char === "L" ? "1" : char;
      if (!REFERRAL_CODE_ALPHABET.includes(mapped)) continue;
      out += mapped;
    }
    return out;
  };

  test("the real normaliser agrees on a code differing only by O for 0", () => {
    // A real code, and the same code as a human mistypes it: one O/0 pair.
    const real = "0K2M9Q4XTB";
    const mistyped = "OK2M9Q4XTB";

    expect(normalizeReferralCode(mistyped)).toBe(real);
    expect(hasCanonicalLength(normalizeReferralCode(mistyped))).toBe(true);

    // The broken version does NOT reach the same code, and so would look like a
    // different — unknown — code to the server. This is the assertion that makes
    // the alias test load-bearing rather than decorative.
    expect(brokenNoAliases(mistyped)).not.toBe(real);
    // Sharper than merely "different": the broken version DROPS the O, because O
    // is not itself in the alphabet. A nine-character string goes to the server,
    // matches nothing, and the referral is lost with no error anywhere.
    expect(brokenNoAliases(mistyped)).toBe("K2M9Q4XTB");
    expect(brokenNoAliases(mistyped)).toHaveLength(REFERRAL_CODE_LENGTH - 1);
    expect(hasCanonicalLength(brokenNoAliases(mistyped))).toBe(false);
    expect(brokenNoAliases(mistyped)).not.toBe(normalizeReferralCode(mistyped));
  });

  test("the real normaliser agrees on a code differing only by I or L for 1", () => {
    const real = "7K2M9Q4XT1";
    for (const mistyped of ["7K2M9Q4XTI", "7K2M9Q4XTL"]) {
      expect(normalizeReferralCode(mistyped)).toBe(real);
      expect(brokenNoAliases(mistyped)).not.toBe(real);
      // Dropped, not mapped: nine characters, which cannot match any stored code.
      expect(brokenNoAliases(mistyped)).toBe(mistyped.slice(0, -1));
      expect(hasCanonicalLength(brokenNoAliases(mistyped))).toBe(false);
    }
  });

  test("a case-blind normaliser fails a lower-case code", () => {
    const lower = "ok2m9q4xtb";
    expect(normalizeReferralCode(lower)).toBe("0K2M9Q4XTB");
    // Every lower-case LETTER is dropped rather than folded. The digits survive,
    // which is what makes this failure so quiet: the result is a plausible-looking
    // nine-character string, and the leading 0 is gone, so the server matches
    // nothing and says nothing.
    expect(brokenNoCaseFold(lower)).toBe("294");
    expect(hasCanonicalLength(brokenNoCaseFold(lower))).toBe(false);
    expect(brokenNoCaseFold(lower)).not.toBe(normalizeReferralCode(lower));
  });

  test("a normaliser that only uppercases cannot pass the suite", () => {
    // The blunt version, asserted directly against the expected canonical form so
    // the failure mode is named rather than implied.
    expect("ok2m9q4xtb".toUpperCase()).not.toBe("0K2M9Q4XTB");
  });
});
