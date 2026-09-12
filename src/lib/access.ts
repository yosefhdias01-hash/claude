import type { Department } from "@/types/kpi";
import type { CurrentUser } from "@/types/user";

/**
 * Departemen yang boleh dilihat pengguna: superadmin melihat semua,
 * anggota hanya melihat departemennya sendiri (§8 PRD).
 */
export function getVisibleDepartments(user: CurrentUser, departments: Department[]): Department[] {
  if (user.role === "superadmin") return departments;
  return departments.filter((department) => department.id === user.departmentId);
}
