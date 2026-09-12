"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Kpi, KpiEntry } from "@/types/kpi";
import { entriesForKpi } from "@/lib/mock-entries";
import { filterEntriesByRange, filterEntriesUpTo } from "@/lib/kpi-entries";
import { usePeriodFilter } from "@/contexts/period-filter-context";

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

/**
 * Entri satu KPI yang disaring KE DUA batas rentang filter periode aktif
 * (§7.5 PRD). Dipakai kartu Ringkasan Target Bulanan & agregat departemen,
 * yang memang harus mencerminkan capaian PADA periode itu saja. Halaman
 * Isi Angka (riwayat perubahan) sengaja tetap memakai `useKpiEntries`
 * mentah karena audit trail tidak ikut disaring oleh filter dashboard.
 */
export function useFilteredKpiEntries(kpi: Kpi): KpiEntry[] {
  const entries = useKpiEntries(kpi);
  const { range } = usePeriodFilter();
  return useMemo(() => filterEntriesByRange(entries, range), [entries, range]);
}

/** Versi `useFilteredKpiEntries` untuk beberapa KPI sekaligus (dipakai Ringkasan departemen). */
export function useFilteredKpiEntriesGetter(): (kpi: Kpi) => KpiEntry[] {
  const getEntries = useKpiEntriesGetter();
  const { range } = usePeriodFilter();
  return useCallback((kpi: Kpi) => filterEntriesByRange(getEntries(kpi), range), [getEntries, range]);
}

/**
 * Entri sampai akhir rentang filter periode aktif (batas atas saja).
 * Dipakai grafik tren: filter periode menggeser titik "per tanggal ini"
 * (mis. "Bulan Lalu" → tren mingguan/bulanan sampai akhir bulan lalu),
 * bukan mempersempit jadi cuma rentang periode itu sendiri — kalau
 * disaring ke dua batas, grafik jadi nyaris kosong untuk periode
 * sesempit "Bulan Ini".
 */
export function useEndBoundedKpiEntries(kpi: Kpi): KpiEntry[] {
  const entries = useKpiEntries(kpi);
  const { range } = usePeriodFilter();
  return useMemo(() => filterEntriesUpTo(entries, range.end), [entries, range.end]);
}

/** Versi `useEndBoundedKpiEntries` untuk beberapa KPI sekaligus (dipakai mode perbandingan grafik). */
export function useEndBoundedKpiEntriesGetter(): (kpi: Kpi) => KpiEntry[] {
  const getEntries = useKpiEntriesGetter();
  const { range } = usePeriodFilter();
  return useCallback((kpi: Kpi) => filterEntriesUpTo(getEntries(kpi), range.end), [getEntries, range.end]);
}
