import { departments } from "@/lib/kpi-data";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { DepartmentSection } from "@/components/dashboard/department-section";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 px-4 py-6 sm:px-8 dark:bg-black">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard KPI Divisi</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Capaian KPI seluruh departemen dalam satu layar.
        </p>
      </header>

      <FilterBar />

      <main className="flex flex-col gap-10">
        {departments.map((department) => (
          <DepartmentSection key={department.id} department={department} />
        ))}
      </main>
    </div>
  );
}
