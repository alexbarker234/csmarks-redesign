export const generateBellCurveData = (
  mean: number,
  stdDev: number,
  numStudents: number
): number[] => {
  const generateGaussian = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    const randStdNormal =
      Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    return mean + stdDev * randStdNormal;
  };

  // Generate scores between 0 and 100
  const scores: number[] = [];
  for (let i = 0; i < numStudents; i++) {
    let score = generateGaussian();

    // Clamp values between 0 and 100
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    scores.push(score);
  }

  return scores;
};

export const convertToBins = (scores: number[], numBins: number): number[] => {
  const bins = new Array(numBins).fill(0);

  const binSize = 100 / numBins;

  scores.forEach((score) => {
    const binIndex = Math.min(Math.floor(score / binSize), numBins - 1);
    bins[binIndex] += 1;
  });

  return bins;
};
