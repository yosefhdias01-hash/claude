import type { Kpi } from "@/types/kpi";
import { computeAchievement, formatGap, formatKpiValue, formatPercentage } from "@/lib/kpi-metrics";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const { percentage, gap } = computeAchievement(kpi);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{kpi.name}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Target: {kpi.targetLabel}</p>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Tercapai</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {formatKpiValue(kpi.currentValue, kpi.valueUnit)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Pencapaian</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {formatPercentage(percentage)}
          </p>
        </div>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Gap ke target: <span className="font-medium">{formatGap(gap, kpi.valueUnit)}</span>
      </p>
    </div>
  );
}
