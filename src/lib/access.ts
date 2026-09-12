import type { Department, Kpi } from "@/types/kpi";
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
 * Peran berhak mengisi angka KPI (§7.4 & §3 PRD: "Anggota tim (per role)"):
 * superadmin boleh mengisi KPI apa pun; anggota hanya boleh mengisi KPI
 * milik role-nya sendiri, bukan sekadar departemen yang sama — anggota
 * Paid Ads Specialist tidak otomatis berhak mengisi KPI Social Media
 * Specialist meski satu departemen.
 */
export function canFillKpi(user: CurrentUser, kpi: Kpi): boolean {
  if (user.role === "superadmin") return true;
  return user.roleId === kpi.roleId;
}
