"use client";

import type { Department } from "@/types/kpi";
import { getVisibleDepartments } from "@/lib/access";
import { useCurrentUser } from "@/contexts/current-user-context";
import { useDepartmentFilter } from "@/contexts/department-filter-context";
import { DepartmentSection } from "@/components/dashboard/department-section";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";

export function DashboardView({ departments }: { departments: Department[] }) {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { selectedDepartmentId } = useDepartmentFilter();
  const accessibleDepartments = getVisibleDepartments(currentUser, departments);
  const visibleDepartments =
    selectedDepartmentId === "semua"
      ? accessibleDepartments
      : accessibleDepartments.filter((department) => department.id === selectedDepartmentId);

  return (
    <div className="flex flex-col gap-6">
      <RoleSwitcher currentUser={currentUser} onChange={setCurrentUser} />
      <FilterBar />

      <main className="flex flex-col gap-10">
        {visibleDepartments.length > 0 ? (
          visibleDepartments.map((department) => (
            <DepartmentSection key={department.id} department={department} currentUser={currentUser} />
          ))
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tidak ada departemen yang bisa ditampilkan untuk peran ini.
          </p>
        )}
      </main>
    </div>
  );
}
