import test from "node:test";
import assert from "node:assert/strict";
import { analyzeNumbers } from "../src/utils/analyzeNumbers.js";

test("returns the sum of even numbers and the average of odd numbers", () => {
  const result = analyzeNumbers([1, 2, 3, 4, 5, "a", null]);

  assert.deepEqual(result, {
    somaPares: 6,
    mediaImpares: 3,
  });
});

test("ignores invalid values inside the array", () => {
  const result = analyzeNumbers([2, 4, "10", null, undefined, {}, []]);

  assert.deepEqual(result, {
    somaPares: 6,
    mediaImpares: 0,
  });
});

test("handles empty arrays", () => {
  const result = analyzeNumbers([]);

  assert.deepEqual(result, {
    somaPares: 0,
    mediaImpares: 0,
  });
});

test("throws an error when input is not an array", () => {
  assert.throws(() => analyzeNumbers(null), TypeError);
  assert.throws(() => analyzeNumbers("1,2,3"), TypeError);
  assert.throws(() => analyzeNumbers(undefined), TypeError);
});
