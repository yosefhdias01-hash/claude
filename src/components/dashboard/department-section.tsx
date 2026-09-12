import type { Department } from "@/types/kpi";
import { rolesByDepartment } from "@/lib/kpi-data";
import { RoleSection } from "@/components/dashboard/role-section";

export function DepartmentSection({ department }: { department: Department }) {
  const departmentRoles = rolesByDepartment(department.id);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{department.name}</h2>
      <div className="flex flex-col gap-6">
        {departmentRoles.map((role) => (
          <RoleSection key={role.id} role={role} />
        ))}
      </div>
    </section>
  );
}
