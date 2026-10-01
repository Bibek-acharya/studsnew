/**
 * The StudsToken referral code, normalised in the browser the way the server
 * normalises it.
 *
 * ## Why this file exists at all
 *
 * The code is a HUMAN-INPUT field, and a mismatch between "the code as stored"
 * and "the code as typed" is a lost referral rather than a validation error: the
 * student is told nothing, because from the server's point of view they simply
 * never arrived with a code. The server already handles this —
 * `internal/shared/utils/referral_code.go` `NormalizeReferralCode` — but the
 * invite link is read here first, at `/r/[code]`, and the result is what gets
 * carried into `/register?ref=`. A client that normalises differently from the
 * server turns a working shared link into a silent no-op, which is the worst
 * possible failure for a feature whose entire value is one person telling
 * another person a nine-character string.
 *
 * So the rule below is a transcription of the Go function, not a
 * reimplementation of the idea. The two are kept in step by the header comment
 * naming the Go symbol, and by a test that pins every case in it.
 *
 * ## The exact rule
 *
 * For each character of the input, in order:
 *
 *  1. Uppercase it.
 *  2. Apply the Crockford base32 DECODE aliases: `O` reads as `0`, and `I` and
 *     `L` both read as `1`. These are the pairs people mistype when reading a
 *     code off a screen, and mapping them can only ever turn a near-miss into a
 *     hit — `I`, `L`, `O` and `U` are never generated, so no valid code can be
 *     damaged by the mapping.
 *  3. Keep it if it is in the 32-symbol alphabet
 *     `0123456789ABCDEFGHJKMNPQRSTVWXYZ`. Drop it otherwise.
 *
 * Step 3 does three jobs at once, which is why it is a membership test rather
 * than a character class: it drops the Crockford letters that are not aliases
 * (notably `U`), it drops every separator a chat client or a printed leaflet
 * introduces (a space or a hyphen is noise — codes are generated without
 * separators), and it drops the punctuation and emoji that arrive when someone
 * pastes a whole sentence into a box.
 *
 * ## The one place this deliberately does NOT improve on the server
 *
 * A normalised code is not validated here, and the result may be empty or the
 * wrong length. That is the server's answer too: `ReferralCodeHasCanonicalLength`
 * is documented as "a cheap pre-filter, NOT a validation", and a code that
 * survives normalisation but matches no row has the same outcome as one that
 * was dropped. Reporting "that code does not exist" would leak whether a code is
 * real, which `03-api-contract.md` §2.5 goes out of its way to prevent by having
 * no such endpoint to enumerate against.
 */

/** The 32 symbols a generated code is drawn from. Go: `referralCodeAlphabet`. */
export const REFERRAL_CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Ten characters of 5 bits each. Go: `ReferralCodeLength`. */
export const REFERRAL_CODE_LENGTH = 10;

/**
 * Uppercase one character, ASCII only.
 *
 * `String.prototype.toUpperCase` is NOT used, and the difference is load-bearing.
 * It performs full Unicode case mapping, so `"ß"` becomes `"SS"` — two
 * characters where the input had one. Go's `strings.ToUpper` uses SIMPLE case
 * mapping and leaves `"ß"` alone, where the Go function then drops it for not
 * being in the alphabet.
 *
 * Simple ASCII folding reproduces Go's result for every input: the alphabet is
 * ASCII, so a non-ASCII character can only ever be dropped, and whether it was
 * folded on the way to being dropped makes no difference to the output. A code
 * is a bearer token, so "equivalent for the codes that matter" is not good
 * enough — this is byte-for-byte equivalent for the inputs that differ, and the
 * long tail is provably identical.
 */
function asciiUpper(char: string): string {
  return char >= "a" && char <= "z"
    ? String.fromCharCode(char.charCodeAt(0) - 32)
    : char;
}

/**
 * Put a code into the canonical form stored codes are in.
 *
 * See the file header for the rule and for why the client and the server must
 * agree on it. Exported as a pure function with no storage, no clock and no
 * network so the whole rule is testable in one place.
 */
export function normalizeReferralCode(raw: string | null | undefined): string {
  if (typeof raw !== "string" || raw.length === 0) return "";
  let out = "";
  // `for…of` iterates code points, matching Go's `for _, r := range`. A
  // surrogate half is not in the alphabet and is dropped either way.
  for (const char of raw) {
    let mapped = asciiUpper(char);
    if (mapped === "O") mapped = "0";
    else if (mapped === "I" || mapped === "L") mapped = "1";
    if (!REFERRAL_CODE_ALPHABET.includes(mapped)) continue;
    out += mapped;
  }
  return out;
}

/**
 * Whether a normalised code is the right length.
 *
 * A pre-filter and nothing more, exactly as `ReferralCodeHasCanonicalLength` is
 * documented on the Go side: a code of the wrong length cannot match any stored
 * code, so there is no point sending it. It is NOT a statement that the code is
 * unknown, and callers must not turn it into an error the student can read.
 */
export function hasCanonicalLength(code: string | null | undefined): boolean {
  return typeof code === "string" && code.length === REFERRAL_CODE_LENGTH;
}

/**
 * Normalise and length-check in one step: the only question a link can answer
 * about itself.
 *
 * Returns the canonical code, or null when the input cannot be one. A null here
 * is a "carry on regardless" signal, never a dead end — see the `/r/[code]`
 * route, which redirects either way.
 */
export function asUsableReferralCode(
  raw: string | null | undefined,
): string | null {
  const code = normalizeReferralCode(raw);
  return hasCanonicalLength(code) ? code : null;
}
