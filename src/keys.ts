// Conventions shared by every source's `importedId`.
//
// Actual matches an incoming transaction to an existing one by `imported_id`
// alone (an exact, per-account match). If the key a source builds for the same
// movement ever changes, the movement is imported a second time instead of
// being recognised — so every part of a key must be normalised, never raw
// export text.
//
// Two genuinely distinct movements can also be identical in everything a bank
// export reports (same date, concept and amount — a pair of 500 € transfers on
// the same day is a real thing). They still need distinct keys, so a key that
// repeats within one file carries an occurrence suffix: the first occurrence
// keeps the bare key, the second gets `|#2`, the third `|#3`, and so on.

const OCCURRENCE_SUFFIX = /\|#(\d+)$/;

/** Append the occurrence suffix; occurrence 1 keeps the bare key. */
export function withOccurrence(base: string, occurrence: number): string {
  if (!Number.isInteger(occurrence) || occurrence < 1) {
    throw new Error(`Occurrence must be a positive integer, got ${occurrence}`);
  }
  return occurrence === 1 ? base : `${base}|#${occurrence}`;
}

/** Split a key back into its base and its occurrence number. */
export function splitOccurrence(key: string): { base: string; occurrence: number } {
  const match = key.match(OCCURRENCE_SUFFIX);
  if (!match) return { base: key, occurrence: 1 };
  return { base: key.slice(0, -match[0].length), occurrence: Number(match[1]) };
}

/**
 * The amount as it appears inside a key: always two decimals, so the same
 * movement exported as `-12.3` and as `-12.30` yields one key.
 */
export function formatKeyAmount(cents: number): string {
  if (!Number.isFinite(cents)) {
    throw new Error(`Amount must be a finite number of cents, got ${cents}`);
  }
  // `-0` would render as "0.00" via toFixed, which is what we want anyway.
  return (cents / 100).toFixed(2);
}

/** Parse an amount as written in an export (or in an older key) into cents. */
export function parseKeyAmount(raw: string): number {
  const text = String(raw).trim().replace(",", ".");
  const value = text === "" ? Number.NaN : Number(text);
  if (!Number.isFinite(value)) {
    throw new Error(`Unrecognised amount: ${JSON.stringify(raw)}`);
  }
  return Math.round(value * 100);
}
