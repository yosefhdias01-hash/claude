"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Kpi, KpiEntry } from "@/types/kpi";
import { entriesForKpi } from "@/lib/mock-entries";

type EntriesByKpi = Record<string, KpiEntry[]>;

interface KpiEntriesStore {
  getEntries: (kpi: Kpi) => KpiEntry[];
  addEntry: (kpi: Kpi, entry: Pick<KpiEntry, "value" | "recordedAt" | "note" | "changedBy">) => void;
}

const KpiEntriesContext = createContext<KpiEntriesStore | null>(null);

/**
 * Sumber data entri KPI yang reaktif: dipakai grafik tren agar otomatis
 * ter-update begitu ada entri baru (§ Grafik ikut filter global & update
 * otomatis), tanpa menunggu reload halaman. Diletakkan di root layout agar
 * state-nya tetap hidup saat berpindah antara dashboard dan halaman Isi
 * Angka (navigasi client-side Next.js tidak me-remount komponen bersama).
 */
export function KpiEntriesProvider({ children }: { children: ReactNode }) {
  const [entriesByKpi, setEntriesByKpi] = useState<EntriesByKpi>({});

  const getEntries = useCallback(
    (kpi: Kpi) => entriesByKpi[kpi.id] ?? entriesForKpi(kpi),
    [entriesByKpi],
  );

  const addEntry = useCallback(
    (kpi: Kpi, entry: Pick<KpiEntry, "value" | "recordedAt" | "note" | "changedBy">) => {
      setEntriesByKpi((current) => {
        const existing = current[kpi.id] ?? entriesForKpi(kpi);
        const newEntry: KpiEntry = {
          id: `${kpi.id}-${entry.recordedAt}-${existing.length}`,
          kpiId: kpi.id,
          changedAt: new Date().toISOString(),
          ...entry,
        };
        return { ...current, [kpi.id]: [...existing, newEntry] };
      });
    },
    [],
  );

  const store = useMemo(() => ({ getEntries, addEntry }), [getEntries, addEntry]);

  return <KpiEntriesContext.Provider value={store}>{children}</KpiEntriesContext.Provider>;
}

function useKpiEntriesStore(): KpiEntriesStore {
  const context = useContext(KpiEntriesContext);
  if (!context) throw new Error("useKpiEntriesStore harus dipakai di dalam KpiEntriesProvider");
  return context;
}

/** Entri terkini satu KPI; ikut ter-update otomatis saat `addEntry` dipanggil. */
export function useKpiEntries(kpi: Kpi): KpiEntry[] {
  return useKpiEntriesStore().getEntries(kpi);
}

/** Fungsi untuk menambah entri baru; dipakai fitur Isi Angka Manual (menyusul). */
export function useAddKpiEntry() {
  return useKpiEntriesStore().addEntry;
}

/** Untuk komponen yang butuh entri beberapa KPI sekaligus (mis. mode perbandingan). */
export function useKpiEntriesGetter(): (kpi: Kpi) => KpiEntry[] {
  return useKpiEntriesStore().getEntries;
}
