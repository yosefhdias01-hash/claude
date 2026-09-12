import type { Kpi } from "@/types/kpi";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{kpi.name}</h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Target: {kpi.targetLabel}</p>
    </div>
  );
}
