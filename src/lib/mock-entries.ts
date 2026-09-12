import type { Kpi, KpiEntry } from "@/types/kpi";
import { hashString, mulberry32 } from "@/lib/prng";

/** Tanggal acuan data tiruan, supaya hasil generate konsisten antar-render. */
export const MOCK_ENTRIES_REFERENCE_DATE = "2026-09-12";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Entri tiruan harian/mingguan untuk satu KPI selama ~60 hari terakhir,
 * mensimulasikan pencatatan lewat fitur Isi Angka Manual. Entri terakhir
 * (paling baru) selalu sama dengan `kpi.currentValue` agar konsisten dengan
 * kartu ringkasan target.
 */
export function entriesForKpi(kpi: Kpi): KpiEntry[] {
  const random = mulberry32(hashString(kpi.id));
  const referenceDate = new Date(`${MOCK_ENTRIES_REFERENCE_DATE}T00:00:00Z`);
  const entryCount = 70; // ~7 bulan histori (spasi 3 hari), cukup untuk agregasi mingguan & bulanan
  const daySpacing = 3;

  const entries: KpiEntry[] = [];
  for (let i = entryCount - 1; i >= 0; i -= 1) {
    const date = new Date(referenceDate);
    date.setUTCDate(date.getUTCDate() - i * daySpacing);

    const value =
      i === 0
        ? kpi.currentValue
        : Math.max(0, Math.round(kpi.currentValue * (1 + (random() - 0.5) * 0.3) * 10) / 10);

    entries.push({
      id: `${kpi.id}-${toIsoDate(date)}`,
      kpiId: kpi.id,
      value,
      recordedAt: toIsoDate(date),
    });
  }

  return entries;
}
