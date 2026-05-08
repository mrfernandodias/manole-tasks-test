/**
 * Analyzes an array of values and returns the sum of even integers
 * and the average of odd integers.
 *
 * Invalid values are ignored. Only integers are considered.
 *
 * @param {unknown[]} values
 * @returns {{ somaPares: number, mediaImpares: number }}
 * @throws {TypeError} When the input is not an array.
 */
export function analyzeNumbers(values) {
  if (!Array.isArray(values)) {
    throw new TypeError("Input must be an array.");
  }

  const validNumbers = values.filter(Number.isInteger);

  const evenNumbers = validNumbers.filter((number) => number % 2 === 0);
  const oddNumbers = validNumbers.filter((number) => number % 2 !== 0);

  const evenSum = evenNumbers.reduce((sum, number) => sum + number, 0);

  const oddAverage =
    oddNumbers.length > 0
      ? oddNumbers.reduce((sum, number) => sum + number, 0) / oddNumbers.length
      : 0;

  return {
    somaPares: evenSum,
    mediaImpares: oddAverage,
  };
}
