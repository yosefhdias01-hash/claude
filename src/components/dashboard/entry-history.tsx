"use client";

import type { Kpi } from "@/types/kpi";
import { useKpiEntries } from "@/contexts/kpi-entries-context";
import { formatKpiValue } from "@/lib/kpi-metrics";

const changedAtFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Riwayat perubahan (audit trail) — wajib ada untuk setiap perubahan nilai, §7.4 PRD. */
export function EntryHistory({ kpi }: { kpi: Kpi }) {
  const entries = useKpiEntries(kpi);
  const sorted = [...entries].sort((a, b) => b.changedAt.localeCompare(a.changedAt));

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Riwayat Perubahan</h2>
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-white text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="py-1.5 pr-2 font-medium">Periode</th>
              <th className="py-1.5 pr-2 font-medium">Nilai</th>
              <th className="py-1.5 pr-2 font-medium">Catatan</th>
              <th className="py-1.5 pr-2 font-medium">Diubah oleh</th>
              <th className="py-1.5 font-medium">Waktu perubahan</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry) => (
              <tr key={entry.id} className="border-t border-zinc-100 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                <td className="py-1.5 pr-2 whitespace-nowrap">{entry.recordedAt}</td>
                <td className="py-1.5 pr-2 whitespace-nowrap">{formatKpiValue(entry.value, kpi.valueUnit)}</td>
                <td className="py-1.5 pr-2 text-zinc-500 dark:text-zinc-400">{entry.note ?? "-"}</td>
                <td className="py-1.5 pr-2 whitespace-nowrap">{entry.changedBy}</td>
                <td className="py-1.5 whitespace-nowrap text-zinc-500 dark:text-zinc-400">
                  {changedAtFormatter.format(new Date(entry.changedAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
