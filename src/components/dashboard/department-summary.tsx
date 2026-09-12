import type { DepartmentSummary as DepartmentSummaryData } from "@/lib/kpi-metrics";
import { KPI_STATUS_LABEL, formatPercentage } from "@/lib/kpi-metrics";

const STATUS_DOT_CLASS = {
  tercapai: "bg-emerald-500",
  mendekati: "bg-amber-500",
  dibawah: "bg-red-500",
} as const;

export function DepartmentSummary({ summary }: { summary: DepartmentSummaryData }) {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Rata-rata Pencapaian</p>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {formatPercentage(summary.averagePercentage)}
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {(Object.keys(STATUS_DOT_CLASS) as Array<keyof typeof STATUS_DOT_CLASS>).map((status) => (
          <div key={status} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT_CLASS[status]}`} />
            {KPI_STATUS_LABEL[status]}: {summary.counts[status]}
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-400">{summary.totalKpis} KPI aktif</p>
    </div>
  );
}
