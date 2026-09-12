"use client";

import type { Department } from "@/types/kpi";
import type { CurrentUser } from "@/types/user";
import { kpisByDepartment, rolesByDepartment } from "@/lib/kpi-data";
import { computeDepartmentSummary } from "@/lib/kpi-metrics";
import { latestEntryValue } from "@/lib/kpi-entries";
import { useFilteredKpiEntriesGetter } from "@/contexts/kpi-entries-context";
import { DepartmentSummary } from "@/components/dashboard/department-summary";
import { RoleSection } from "@/components/dashboard/role-section";
import { TrendChart } from "@/components/dashboard/trend-chart";

export function DepartmentSection({
  department,
  currentUser,
}: {
  department: Department;
  currentUser: CurrentUser;
}) {
  const getEntries = useFilteredKpiEntriesGetter();
  const departmentRoles = rolesByDepartment(department.id);
  const departmentKpis = kpisByDepartment(department.id);
  const summary = computeDepartmentSummary(departmentKpis, (kpi) => latestEntryValue(kpi, getEntries(kpi)));

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{department.name}</h2>
      <DepartmentSummary summary={summary} />
      <TrendChart kpis={departmentKpis} />
      <div className="flex flex-col gap-6">
        {departmentRoles.map((role) => (
          <RoleSection key={role.id} role={role} currentUser={currentUser} />
        ))}
      </div>
    </section>
  );
}
