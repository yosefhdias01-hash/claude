"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { computePeriodRange, type PeriodMode, type PeriodRange } from "@/lib/period";
import { MOCK_ENTRIES_REFERENCE_DATE } from "@/lib/mock-entries";

interface PeriodFilterContextValue {
  mode: PeriodMode;
  setMode: (mode: PeriodMode) => void;
  customRange: PeriodRange;
  setCustomRange: (range: PeriodRange) => void;
  /** Rentang tanggal aktif hasil resolusi `mode` (+ `customRange` bila mode "kustom"). */
  range: PeriodRange;
}

const PeriodFilterContext = createContext<PeriodFilterContextValue | null>(null);

const PERIOD_MODES: PeriodMode[] = ["bulan-ini", "bulan-lalu", "kustom"];
function isPeriodMode(value: string | null): value is PeriodMode {
  return PERIOD_MODES.includes(value as PeriodMode);
}

/**
 * Kontrol filter periode (§7.5 PRD) — state-nya di context supaya kartu
 * ringkasan & grafik yang berada jauh di dalam pohon komponen bisa ikut
 * membaca rentang aktif. Dibaca dari & disinkronkan ke query string URL
 * halaman dashboard ("/") agar filter yang dipilih tetap ada saat
 * di-refresh atau dibagikan (§ Sinkronkan filter... + simpan di URL).
 */
export function PeriodFilterProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<PeriodMode>(() => {
    const fromUrl = searchParams.get("periode");
    return isPeriodMode(fromUrl) ? fromUrl : "bulan-ini";
  });
  const [customRange, setCustomRange] = useState<PeriodRange>(() => ({
    start: searchParams.get("dari") ?? MOCK_ENTRIES_REFERENCE_DATE,
    end: searchParams.get("sampai") ?? MOCK_ENTRIES_REFERENCE_DATE,
  }));

  const range = useMemo(
    () => computePeriodRange(mode, MOCK_ENTRIES_REFERENCE_DATE, customRange),
    [mode, customRange],
  );

  useEffect(() => {
    if (pathname !== "/") return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("periode", mode);
    if (mode === "kustom") {
      params.set("dari", customRange.start);
      params.set("sampai", customRange.end);
    } else {
      params.delete("dari");
      params.delete("sampai");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // Sengaja tidak menyertakan `searchParams`/`router` di deps: keduanya
    // berubah identitasnya setiap replace ini sendiri berjalan, dan hanya
    // dipakai untuk membaca query string ketika efek ini benar-benar perlu
    // jalan (perubahan pathname/mode/customRange).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mode, customRange]);

  const value = useMemo(
    () => ({ mode, setMode, customRange, setCustomRange, range }),
    [mode, customRange, range],
  );

  return <PeriodFilterContext.Provider value={value}>{children}</PeriodFilterContext.Provider>;
}

export function usePeriodFilter(): PeriodFilterContextValue {
  const context = useContext(PeriodFilterContext);
  if (!context) throw new Error("usePeriodFilter harus dipakai di dalam PeriodFilterProvider");
  return context;
}
