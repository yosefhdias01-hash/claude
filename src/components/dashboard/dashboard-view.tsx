"use client";

import { useState } from "react";
import type { Department } from "@/types/kpi";
import { getVisibleDepartments } from "@/lib/access";
import { defaultMockUser } from "@/lib/mock-users";
import { DepartmentSection } from "@/components/dashboard/department-section";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";

export function DashboardView({ departments }: { departments: Department[] }) {
  const [currentUser, setCurrentUser] = useState(defaultMockUser);
  const visibleDepartments = getVisibleDepartments(currentUser, departments);

  return (
    <div className="flex flex-col gap-6">
      <RoleSwitcher currentUser={currentUser} onChange={setCurrentUser} />
      <FilterBar />

      <main className="flex flex-col gap-10">
        {visibleDepartments.length > 0 ? (
          visibleDepartments.map((department) => (
            <DepartmentSection key={department.id} department={department} />
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
