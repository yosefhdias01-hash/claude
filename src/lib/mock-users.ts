import type { CurrentUser } from "@/types/user";

/**
 * Pengguna tiruan untuk mendemokan hak akses per departemen (§8 PRD) sebelum
 * Supabase Auth terpasang di Fase 4. Superadmin melihat semua departemen;
 * anggota hanya melihat departemennya sendiri.
 */
export const mockUsers: CurrentUser[] = [
  { id: "superadmin", name: "Head of Dept. Marketing & Communication", role: "superadmin", departmentId: null },
  { id: "anggota-digital-marketing", name: "Anggota Digital Marketing", role: "anggota", departmentId: "digital-marketing" },
  { id: "anggota-multimedia", name: "Anggota Multimedia", role: "anggota", departmentId: "multimedia" },
];

export const defaultMockUser = mockUsers[0];
