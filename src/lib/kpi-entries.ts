import type { Kpi, KpiEntry } from "@/types/kpi";

/**
 * Nilai tercapai terkini sebuah KPI: entri dengan tanggal paling baru, atau
 * `kpi.currentValue` (baseline) bila belum ada entri sama sekali. Dipakai
 * agar Ringkasan Target Bulanan & agregat departemen ikut ter-propagasi
 * begitu ada entri baru dari Isi Angka Manual.
 *
 * Untuk entri bertanggal sama (revisi di hari yang sama, §7.4 "boleh edit
 * dan revisi"), yang terakhir ditambahkan yang menang — karenanya pakai
 * `>=`, bukan `>`, supaya entri baru mengalahkan entri lama pada tanggal
 * yang sama alih-alih dipertahankan begitu saja.
 */
export function latestEntryValue(kpi: Kpi, entries: KpiEntry[]): number {
  if (entries.length === 0) return kpi.currentValue;

  const latest = entries.reduce((mostRecent, entry) =>
    entry.recordedAt >= mostRecent.recordedAt ? entry : mostRecent,
  );
  return latest.value;
}
