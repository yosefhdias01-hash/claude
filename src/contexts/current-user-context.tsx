"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CurrentUser } from "@/types/user";
import { defaultMockUser } from "@/lib/mock-users";

interface CurrentUserContextValue {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

/**
 * Simulasi sesi login (sementara, sebelum Supabase Auth di Fase 4), dipasang
 * di root layout agar halaman lain (mis. Isi Angka Manual) juga tahu siapa
 * pengguna saat ini — dibutuhkan untuk mencatat audit trail siapa yang
 * mengubah nilai KPI.
 */
export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(defaultMockUser);
  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = useContext(CurrentUserContext);
  if (!context) throw new Error("useCurrentUser harus dipakai di dalam CurrentUserProvider");
  return context;
}
