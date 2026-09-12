"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DepartmentId } from "@/types/kpi";
import { departments } from "@/lib/kpi-data";
import { useCurrentUser } from "@/contexts/current-user-context";

export type DepartmentFilterValue = DepartmentId | "semua";

interface DepartmentFilterContextValue {
  selectedDepartmentId: DepartmentFilterValue;
  setSelectedDepartmentId: (id: DepartmentFilterValue) => void;
  /** Non-superadmin tidak bisa mengubah filter ini — selalu terkunci ke departemennya sendiri (§8 PRD). */
  locked: boolean;
}

const DepartmentFilterContext = createContext<DepartmentFilterContextValue | null>(null);

function isDepartmentId(value: string | null): value is DepartmentId {
  return departments.some((department) => department.id === value);
}

/**
 * Kontrol filter departemen (§7.5 PRD). Untuk non-superadmin, filter
 * dikunci ke departemennya sendiri — konsisten dengan hak akses lihat
 * departemen (§8) yang sudah membatasi mereka hanya melihat satu
 * departemen, jadi kontrolnya seharusnya tidak bisa diubah ke departemen
 * lain sama sekali. Dibaca dari & disinkronkan ke query string URL
 * halaman dashboard, mengikuti pola `PeriodFilterProvider`.
 */
export function DepartmentFilterProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useCurrentUser();
  const locked = currentUser.role !== "superadmin";
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hanya dipakai saat TIDAK terkunci; saat terkunci, nilai diturunkan langsung
  // dari currentUser.departmentId di bawah (bukan disinkronkan lewat effect).
  const [manualSelection, setManualSelection] = useState<DepartmentFilterValue>(() => {
    const fromUrl = searchParams.get("departemen");
    return isDepartmentId(fromUrl) ? fromUrl : "semua";
  });

  const selectedDepartmentId: DepartmentFilterValue = locked
    ? (currentUser.departmentId ?? "semua")
    : manualSelection;

  function setSelectedDepartmentId(id: DepartmentFilterValue) {
    if (locked) return;
    setManualSelection(id);
  }

  useEffect(() => {
    if (pathname !== "/" || locked) return;
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDepartmentId === "semua") {
      params.delete("departemen");
    } else {
      params.set("departemen", selectedDepartmentId);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locked, selectedDepartmentId]);

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
