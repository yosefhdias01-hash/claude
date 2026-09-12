import type { Kpi, KpiEntry } from "@/types/kpi";
import type { PeriodRange } from "@/lib/period";

/** Entri yang tanggal periodenya (`recordedAt`) jatuh di dalam rentang filter periode aktif. */
export function filterEntriesByRange(entries: KpiEntry[], range: PeriodRange): KpiEntry[] {
  return entries.filter((entry) => entry.recordedAt >= range.start && entry.recordedAt <= range.end);
}

/**
 * Entri sampai dengan tanggal tertentu saja (tanpa batas bawah). Dipakai
 * grafik tren: filter periode menggeser titik "per tanggal ini" grafiknya
 * (mis. "Bulan Lalu" → tren sampai akhir bulan lalu), bukan mempersempit
 * jadi cuma rentang periode itu sendiri — kalau begitu grafik mingguan/
 * bulanan jadi nyaris kosong untuk periode sesempit "Bulan Ini".
 */
export function filterEntriesUpTo(entries: KpiEntry[], endDate: string): KpiEntry[] {
  return entries.filter((entry) => entry.recordedAt <= endDate);
}

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
