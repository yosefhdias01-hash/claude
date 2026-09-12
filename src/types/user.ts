import type { DepartmentId } from "@/types/kpi";

export type UserRole = "superadmin" | "anggota";

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  /** null berarti tidak terikat satu departemen (khusus superadmin, lihat §8 PRD). */
  departmentId: DepartmentId | null;
  /**
   * Role/jobdesk anggota (mis. "paid-ads-specialist"), null untuk superadmin.
   * Menentukan KPI mana yang boleh diisi (§7.4, §3: "Anggota tim (per role)").
   */
  roleId: string | null;
}
