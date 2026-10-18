export function mean(values: number[]) {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
}

export function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function sampleVariance(values: number[]) {
  if (values.length < 2) return 0;
  const m = mean(values);
  return values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
}

export function sampleSd(values: number[]) {
  return Math.sqrt(sampleVariance(values));
}

export function slovinSampleSize(population: number, margin: number) {
  return Math.round(population / (1 + population * margin * margin));
}

export function interpretMean(value: number) {
  if (value >= 4.2) return "Highly acceptable";
  if (value >= 3.4) return "Acceptable";
  if (value >= 2.6) return "Moderately acceptable";
  if (value >= 1.8) return "Slightly acceptable";
  return "Not acceptable";
}

export function cronbachAlpha(rows: number[][]) {
  const respondents = rows.length;
  const items = rows[0]?.length ?? 0;
  if (items < 2 || respondents < 2) return 0;
  const itemVariances = Array.from({ length: items }, (_, i) => sampleVariance(rows.map((row) => row[i])));
  const totalVariance = sampleVariance(rows.map((row) => row.reduce((sum, v) => sum + v, 0)));
  if (totalVariance === 0) return 0;
  return (items / (items - 1)) * (1 - itemVariances.reduce((sum, v) => sum + v, 0) / totalVariance);
}

export function normalCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const density = Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);
  const tail =
    density * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - tail : tail;
}

function rankWithTies(values: number[]) {
  const order = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const ranks = new Array<number>(values.length);
  const tieSizes: number[] = [];
  let start = 0;
  while (start < order.length) {
    let end = start;
    while (end + 1 < order.length && order[end + 1].value === order[start].value) end++;
    const averageRank = (start + end) / 2 + 1;
    for (let i = start; i <= end; i++) ranks[order[i].index] = averageRank;
    tieSizes.push(end - start + 1);
    start = end + 1;
  }
  return { ranks, tieSizes };
}

export function mannWhitney(a: number[], b: number[]) {
  const n1 = a.length;
  const n2 = b.length;
  const n = n1 + n2;
  if (n1 === 0 || n2 === 0) return { u: 0, z: 0, p: 1, r: 0 };

  const { ranks, tieSizes } = rankWithTies([...a, ...b]);
  const rankSumA = ranks.slice(0, n1).reduce((sum, r) => sum + r, 0);
  const u1 = rankSumA - (n1 * (n1 + 1)) / 2;
  const u = Math.min(u1, n1 * n2 - u1);

  const tieCorrection = tieSizes.reduce((sum, t) => sum + (t ** 3 - t), 0) / (n * (n - 1));
  const sigma = Math.sqrt(((n1 * n2) / 12) * (n + 1 - tieCorrection));
  const z = sigma === 0 ? 0 : (u - (n1 * n2) / 2) / sigma;
  const p = Math.min(1, 2 * normalCdf(-Math.abs(z)));
  return { u, z, p, r: Math.abs(z) / Math.sqrt(n) };
}
