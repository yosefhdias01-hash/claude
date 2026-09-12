import { departments } from "@/lib/kpi-data";

export function FilterBar() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="filter-periode">
          Periode
        </label>
        <select
          id="filter-periode"
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          defaultValue="bulan-ini"
        >
          <option value="bulan-ini">Bulan Ini</option>
          <option value="bulan-lalu">Bulan Lalu</option>
          <option value="kustom">Kustom</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="filter-departemen">
          Departemen
        </label>
        <select
          id="filter-departemen"
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          defaultValue="semua"
        >
          <option value="semua">Semua Departemen</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
