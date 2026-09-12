import type { Kpi } from "@/types/kpi";
import { entriesForKpi } from "@/lib/mock-entries";
import { aggregateMonthly, aggregateWeekly, type TrendPoint } from "@/lib/kpi-aggregation";

export type { TrendPoint };

const WEEKS_SHOWN = 8;
const MONTHS_SHOWN = 6;

export function weeklyTrend(kpi: Kpi): TrendPoint[] {
  return aggregateWeekly(entriesForKpi(kpi), WEEKS_SHOWN);
}

export function monthlyTrend(kpi: Kpi): TrendPoint[] {
  return aggregateMonthly(entriesForKpi(kpi), MONTHS_SHOWN);
}
