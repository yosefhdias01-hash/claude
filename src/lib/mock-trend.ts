import type { Kpi, KpiEntry } from "@/types/kpi";
import { aggregateMonthly, aggregateWeekly, type TrendPoint } from "@/lib/kpi-aggregation";
import { achievementPercentage } from "@/lib/kpi-metrics";

export type { TrendPoint };

const WEEKS_SHOWN = 8;
const MONTHS_SHOWN = 6;

export function weeklyTrend(entries: KpiEntry[]): TrendPoint[] {
  return aggregateWeekly(entries, WEEKS_SHOWN);
}

export function monthlyTrend(entries: KpiEntry[]): TrendPoint[] {
  return aggregateMonthly(entries, MONTHS_SHOWN);
}

/**
 * Tren nilai per titik dikonversi ke persentase pencapaian, sehingga KPI
 * dengan satuan berbeda (mis. "juta" vs "%") bisa dibandingkan pada satu
 * grafik yang sama (lihat mode perbandingan multi-KPI).
 */
function toAchievementTrend(points: TrendPoint[], kpi: Kpi): TrendPoint[] {
  return points.map((point) => ({
    label: point.label,
    value: Math.round(achievementPercentage(point.value, kpi.targetValue, kpi.direction) * 10) / 10,
  }));
}

export function weeklyAchievementTrend(entries: KpiEntry[], kpi: Kpi): TrendPoint[] {
  return toAchievementTrend(weeklyTrend(entries), kpi);
}

export function monthlyAchievementTrend(entries: KpiEntry[], kpi: Kpi): TrendPoint[] {
  return toAchievementTrend(monthlyTrend(entries), kpi);
}
