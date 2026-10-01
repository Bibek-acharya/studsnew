/**
 * The one honest sentence about the gates, in one place.
 *
 * ## Why it lives here rather than in the wallet section
 *
 * It was a private constant in `WalletSection.tsx`, which was right when the
 * wallet was the only surface that showed a StudsToken figure a student might
 * try to spend. It is not right any more, because the referral page shows a
 * second, larger number and a student arrives there having just been told that
 * inviting a friend earns them coins. If the referral page says nothing about
 * what coins can be spent on, the page contradicts the wallet by omission — and
 * the omission is the whole of the claim.
 *
 * So the sentence is exported and imported by both. Two copies of a statement
 * about a product gate is how the two drift apart, and a drift here is not a
 * typo, it is a promise the platform does not keep.
 *
 * ## The wording is unchanged
 *
 * "Not switched on yet" rather than a date, because nobody has committed to a
 * date and `09` §"What support must never promise" is explicit that there is no
 * commitment to when a gate flips. A date here would be invented, and this is
 * the single line most likely to end up wrong.
 *
 * It is a fact about the product, not about the student: no red, no urgency, no
 * countdown, nothing that reads as a fine or a loss. And it does not deny the
 * balance is real — a student with 25 coins is told they have 25 coins, and
 * separately told what those coins can and cannot do yet. Softening the number
 * to a dash would be the actual lie.
 */
export const SPEND_STATUS =
  "Right now you can earn StudsTokens but not spend them yet. Everything you earn is kept, and it starts unlocking resources when that switches on.";
