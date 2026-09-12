import type { Kpi } from "@/types/kpi";
import {
  KPI_STATUS_LABEL,
  computeAchievement,
  computeStatus,
  formatGap,
  formatKpiValue,
  formatPercentage,
  type KpiStatus,
} from "@/lib/kpi-metrics";

const STATUS_BADGE_CLASS: Record<KpiStatus, string> = {
  tercapai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  mendekati: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  dibawah: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const { percentage, gap } = computeAchievement(kpi);
  const status = computeStatus(percentage);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{kpi.name}</h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[status]}`}>
            {KPI_STATUS_LABEL[status]}
          </span>
        </div>
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
