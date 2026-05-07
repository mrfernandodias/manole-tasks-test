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
