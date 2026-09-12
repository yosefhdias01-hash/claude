import type { Department, Kpi } from "@/types/kpi";
import { kpiDepartmentId } from "@/lib/kpi-data";
import type { CurrentUser } from "@/types/user";

/**
 * Departemen yang boleh dilihat pengguna: superadmin melihat semua,
 * anggota hanya melihat departemennya sendiri (§8 PRD).
 */
export function getVisibleDepartments(user: CurrentUser, departments: Department[]): Department[] {
  if (user.role === "superadmin") return departments;
  return departments.filter((department) => department.id === user.departmentId);
}

/**
 * Peran berhak mengisi angka KPI (§7.4 PRD): superadmin, atau anggota dari
 * departemen yang sama dengan KPI tersebut.
 */
export function canFillKpi(user: CurrentUser, kpi: Kpi): boolean {
  if (user.role === "superadmin") return true;
  return user.departmentId === kpiDepartmentId(kpi);
}
