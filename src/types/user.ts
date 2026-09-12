import type { DepartmentId } from "@/types/kpi";

export type UserRole = "superadmin" | "anggota";

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  /** null berarti tidak terikat satu departemen (khusus superadmin, lihat §8 PRD). */
  departmentId: DepartmentId | null;
}
