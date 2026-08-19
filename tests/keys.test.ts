import { test } from "node:test";
import assert from "node:assert/strict";
import {
  withOccurrence,
  splitOccurrence,
  formatKeyAmount,
  parseKeyAmount,
} from "../src/keys.ts";

test("the first occurrence keeps the bare key", () => {
  assert.equal(withOccurrence("a|b", 1), "a|b");
  assert.equal(withOccurrence("a|b", 2), "a|b|#2");
  assert.equal(withOccurrence("a|b", 10), "a|b|#10");
});

test("occurrence must be a positive integer", () => {
  assert.throws(() => withOccurrence("a", 0));
  assert.throws(() => withOccurrence("a", 1.5));
});

test("splitting is the inverse of appending", () => {
  for (const [base, occurrence] of [
    ["a|b", 1],
    ["a|b", 2],
    ["a|b", 37],
  ] as const) {
    assert.deepEqual(splitOccurrence(withOccurrence(base, occurrence)), { base, occurrence });
  }
});

test("a key with no suffix is occurrence 1", () => {
  assert.deepEqual(splitOccurrence("bbva2|2026-04-10|2026-04-10|Bizum|500.00"), {
    base: "bbva2|2026-04-10|2026-04-10|Bizum|500.00",
    occurrence: 1,
  });
});

test("amounts always carry two decimals", () => {
  assert.equal(formatKeyAmount(-1795), "-17.95");
  assert.equal(formatKeyAmount(-390), "-3.90");
  assert.equal(formatKeyAmount(139450), "1394.50");
  assert.equal(formatKeyAmount(-4500), "-45.00");
  assert.equal(formatKeyAmount(0), "0.00");
});

test("amounts written either way parse to the same cents", () => {
  assert.equal(parseKeyAmount("-12.3"), -1230);
  assert.equal(parseKeyAmount("-12.30"), -1230);
  assert.equal(parseKeyAmount("-45"), -4500);
  assert.equal(parseKeyAmount("1394.5"), 139450);
  assert.equal(parseKeyAmount("-130.0"), -13000);
  // TradeRepublic writes decimal commas in some locales.
  assert.equal(parseKeyAmount("-2,90"), -290);
});

test("an unparseable amount is loud", () => {
  assert.throws(() => parseKeyAmount("Bizum"));
  assert.throws(() => parseKeyAmount(""));
});
