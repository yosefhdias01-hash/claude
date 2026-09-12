"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
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

const DEFAULT_CUSTOM_RANGE: PeriodRange = {
  start: MOCK_ENTRIES_REFERENCE_DATE,
  end: MOCK_ENTRIES_REFERENCE_DATE,
};

/**
 * Kontrol filter periode (§7.5 PRD) — state-nya diletakkan di context supaya
 * kartu ringkasan & grafik yang berada jauh di dalam pohon komponen bisa
 * ikut membaca rentang aktif begitu task sinkronisasi filter global
 * (menyusul) menghubungkannya.
 */
export function PeriodFilterProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PeriodMode>("bulan-ini");
  const [customRange, setCustomRange] = useState<PeriodRange>(DEFAULT_CUSTOM_RANGE);

  const range = useMemo(
    () => computePeriodRange(mode, MOCK_ENTRIES_REFERENCE_DATE, customRange),
    [mode, customRange],
  );

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
