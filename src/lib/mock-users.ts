import type { CurrentUser } from "@/types/user";

/**
 * Pengguna tiruan untuk mendemokan hak akses (§8 & §7.4 PRD) sebelum
 * Supabase Auth terpasang di Fase 4. Superadmin melihat semua departemen dan
 * boleh mengisi angka KPI apa pun; anggota hanya melihat departemennya
 * sendiri dan hanya boleh mengisi angka KPI milik role-nya sendiri (§3:
 * "Anggota tim (per role)").
 */
export const mockUsers: CurrentUser[] = [
  {
    id: "superadmin",
    name: "Head of Dept. Marketing & Communication",
    role: "superadmin",
    departmentId: null,
    roleId: null,
  },
  {
    id: "anggota-paid-ads-specialist",
    name: "Anggota - Paid Ads Specialist",
    role: "anggota",
    departmentId: "digital-marketing",
    roleId: "paid-ads-specialist",
  },
  {
    id: "anggota-videografer",
    name: "Anggota - Videografer",
    role: "anggota",
    departmentId: "multimedia",
    roleId: "videografer",
  },
];

export const defaultMockUser = mockUsers[0];
