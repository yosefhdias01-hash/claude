import type { Role } from "@/types/kpi";
import { kpisByRole } from "@/lib/kpi-data";
import { KpiCard } from "@/components/dashboard/kpi-card";

export function RoleSection({ role }: { role: Role }) {
  const roleKpis = kpisByRole(role.id);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{role.name}</h4>
        {!role.active && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            Segera
          </span>
        )}
      </div>
      {roleKpis.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roleKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-400">KPI belum tersedia.</p>
      )}
    </section>
  );
}
