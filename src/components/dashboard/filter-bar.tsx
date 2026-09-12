"use client";

import { departments } from "@/lib/kpi-data";
import { usePeriodFilter } from "@/contexts/period-filter-context";
import { useDepartmentFilter, type DepartmentFilterValue } from "@/contexts/department-filter-context";
import { formatPeriodRange } from "@/lib/period";
import type { PeriodMode } from "@/lib/period";

export function FilterBar() {
  const { mode, setMode, customRange, setCustomRange, range } = usePeriodFilter();
  const { selectedDepartmentId, setSelectedDepartmentId, locked } = useDepartmentFilter();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="filter-periode">
            Periode
          </label>
          <select
            id="filter-periode"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            value={mode}
            onChange={(event) => setMode(event.target.value as PeriodMode)}
          >
            <option value="bulan-ini">Bulan Ini</option>
            <option value="bulan-lalu">Bulan Lalu</option>
            <option value="kustom">Kustom</option>
          </select>
        </div>

        {mode === "kustom" && (
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="filter-periode-start">
                Dari
              </label>
              <input
                id="filter-periode-start"
                type="date"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                value={customRange.start}
                max={customRange.end}
                onChange={(event) => setCustomRange({ ...customRange, start: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="filter-periode-end">
                Sampai
              </label>
              <input
                id="filter-periode-end"
                type="date"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                value={customRange.end}
                min={customRange.start}
                onChange={(event) => setCustomRange({ ...customRange, end: event.target.value })}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="filter-departemen">
            Departemen
          </label>
          <select
            id="filter-departemen"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            value={selectedDepartmentId}
            disabled={locked}
            onChange={(event) => setSelectedDepartmentId(event.target.value as DepartmentFilterValue)}
          >
            <option value="semua">Semua Departemen</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {locked && (
            <p className="text-[11px] text-zinc-400">Terkunci ke departemen Anda.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">Rentang aktif: {formatPeriodRange(range)}</p>
    </div>
  );
}
