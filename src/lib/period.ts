export type PeriodMode = "bulan-ini" | "bulan-lalu" | "kustom";

export interface PeriodRange {
  /** ISO "YYYY-MM-DD", inklusif. */
  start: string;
  end: string;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(year: number, monthIndex: number): Date {
  return new Date(Date.UTC(year, monthIndex, 1));
}

function endOfMonth(year: number, monthIndex: number): Date {
  return new Date(Date.UTC(year, monthIndex + 1, 0));
}

/**
 * Rentang tanggal untuk mode filter periode (§7.5 PRD). "Bulan ini" berhenti
 * di `referenceDate` (bukan akhir bulan) supaya tidak mencakup tanggal yang
 * belum terjadi; "kustom" memakai rentang yang dipilih pengguna sendiri.
 */
export function computePeriodRange(mode: PeriodMode, referenceDate: string, custom?: PeriodRange): PeriodRange {
  const reference = new Date(`${referenceDate}T00:00:00Z`);
  const year = reference.getUTCFullYear();
  const monthIndex = reference.getUTCMonth();

  if (mode === "bulan-ini") {
    return { start: toIsoDate(startOfMonth(year, monthIndex)), end: referenceDate };
  }

  if (mode === "bulan-lalu") {
    return {
      start: toIsoDate(startOfMonth(year, monthIndex - 1)),
      end: toIsoDate(endOfMonth(year, monthIndex - 1)),
    };
  }

  return custom ?? { start: toIsoDate(startOfMonth(year, monthIndex)), end: referenceDate };
}

const periodLabelFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });

export function formatPeriodRange(range: PeriodRange): string {
  const start = periodLabelFormatter.format(new Date(`${range.start}T00:00:00Z`));
  const end = periodLabelFormatter.format(new Date(`${range.end}T00:00:00Z`));
  return `${start} – ${end}`;
}
