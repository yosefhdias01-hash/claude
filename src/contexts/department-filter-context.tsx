"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { DepartmentId } from "@/types/kpi";
import { useCurrentUser } from "@/contexts/current-user-context";

export type DepartmentFilterValue = DepartmentId | "semua";

interface DepartmentFilterContextValue {
  selectedDepartmentId: DepartmentFilterValue;
  setSelectedDepartmentId: (id: DepartmentFilterValue) => void;
  /** Non-superadmin tidak bisa mengubah filter ini — selalu terkunci ke departemennya sendiri (§8 PRD). */
  locked: boolean;
}

const DepartmentFilterContext = createContext<DepartmentFilterContextValue | null>(null);

/**
 * Kontrol filter departemen (§7.5 PRD). Untuk non-superadmin, filter
 * dikunci ke departemennya sendiri — konsisten dengan hak akses lihat
 * departemen (§8) yang sudah membatasi mereka hanya melihat satu
 * departemen, jadi kontrolnya seharusnya tidak bisa diubah ke departemen
 * lain sama sekali.
 */
export function DepartmentFilterProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useCurrentUser();
  const locked = currentUser.role !== "superadmin";

  // Hanya dipakai saat TIDAK terkunci; saat terkunci, nilai diturunkan langsung
  // dari currentUser.departmentId di bawah (bukan disinkronkan lewat effect).
  const [manualSelection, setManualSelection] = useState<DepartmentFilterValue>("semua");
  const selectedDepartmentId: DepartmentFilterValue = locked
    ? (currentUser.departmentId ?? "semua")
    : manualSelection;

  function setSelectedDepartmentId(id: DepartmentFilterValue) {
    if (locked) return;
    setManualSelection(id);
  }

  return (
    <DepartmentFilterContext.Provider value={{ selectedDepartmentId, setSelectedDepartmentId, locked }}>
      {children}
    </DepartmentFilterContext.Provider>
  );
}

export function useDepartmentFilter(): DepartmentFilterContextValue {
  const context = useContext(DepartmentFilterContext);
  if (!context) throw new Error("useDepartmentFilter harus dipakai di dalam DepartmentFilterProvider");
  return context;
}
