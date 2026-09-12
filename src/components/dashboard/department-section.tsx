import type { Department } from "@/types/kpi";
import { kpisByDepartment, rolesByDepartment } from "@/lib/kpi-data";
import { computeDepartmentSummary } from "@/lib/kpi-metrics";
import { DepartmentSummary } from "@/components/dashboard/department-summary";
import { RoleSection } from "@/components/dashboard/role-section";

export function DepartmentSection({ department }: { department: Department }) {
  const departmentRoles = rolesByDepartment(department.id);
  const summary = computeDepartmentSummary(kpisByDepartment(department.id));

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{department.name}</h2>
      <DepartmentSummary summary={summary} />
      <div className="flex flex-col gap-6">
        {departmentRoles.map((role) => (
          <RoleSection key={role.id} role={role} />
        ))}
      </div>
    </section>
  );
}
