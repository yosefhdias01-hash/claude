import type { Kpi } from "@/types/kpi";

export interface TrendPoint {
  label: string;
  value: number;
}

/** PRNG deterministik (mulberry32) supaya data tren tiruan konsisten antar-render. */
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}

function generateSeries(kpi: Kpi, labels: string[]): TrendPoint[] {
  const random = mulberry32(hashString(`${kpi.id}-${labels.length}`));

  return labels.map((label, index) => {
    if (index === labels.length - 1) {
      return { label, value: kpi.currentValue };
    }
    const variance = (random() - 0.5) * 0.3; // fluktuasi ±15%
    const value = Math.max(0, kpi.currentValue * (1 + variance));
    return { label, value: Math.round(value * 10) / 10 };
  });
}

const WEEKLY_LABELS = Array.from({ length: 8 }, (_, index) => `Mgg ${index + 1}`);
const MONTHLY_LABELS = ["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"];

export function weeklyTrend(kpi: Kpi): TrendPoint[] {
  return generateSeries(kpi, WEEKLY_LABELS);
}

export function monthlyTrend(kpi: Kpi): TrendPoint[] {
  return generateSeries(kpi, MONTHLY_LABELS);
}
