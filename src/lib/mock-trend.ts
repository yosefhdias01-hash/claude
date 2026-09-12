import type { Kpi } from "@/types/kpi";
import { entriesForKpi } from "@/lib/mock-entries";
import { aggregateMonthly, aggregateWeekly, type TrendPoint } from "@/lib/kpi-aggregation";
import { achievementPercentage } from "@/lib/kpi-metrics";

export type { TrendPoint };

const WEEKS_SHOWN = 8;
const MONTHS_SHOWN = 6;

export function weeklyTrend(kpi: Kpi): TrendPoint[] {
  return aggregateWeekly(entriesForKpi(kpi), WEEKS_SHOWN);
}

export function monthlyTrend(kpi: Kpi): TrendPoint[] {
  return aggregateMonthly(entriesForKpi(kpi), MONTHS_SHOWN);
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

export function weeklyAchievementTrend(kpi: Kpi): TrendPoint[] {
  return toAchievementTrend(weeklyTrend(kpi), kpi);
}

export function monthlyAchievementTrend(kpi: Kpi): TrendPoint[] {
  return toAchievementTrend(monthlyTrend(kpi), kpi);
}
