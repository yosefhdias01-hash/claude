import type { KpiEntry } from "@/types/kpi";

export interface TrendPoint {
  label: string;
  value: number;
}

/** Kunci ISO week ("tahun-W-nomor minggu") dari sebuah tanggal, standar ISO 8601. */
function isoWeekKey(date: Date): string {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNumber = (target.getUTCDay() + 6) % 7; // Senin=0 ... Minggu=6
  target.setUTCDate(target.getUTCDate() - dayNumber + 3); // geser ke Kamis terdekat

  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);

  const week = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return `${target.getUTCFullYear()}-W${week}`;
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const shortMonthFormatter = new Intl.DateTimeFormat("id-ID", { month: "short" });

interface EntryGroup {
  total: number;
  count: number;
  lastDate: Date;
}

function groupEntries(entries: KpiEntry[], keyFn: (date: Date) => string): Map<string, EntryGroup> {
  const sorted = [...entries].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
  const groups = new Map<string, EntryGroup>();

  for (const entry of sorted) {
    const date = new Date(`${entry.recordedAt}T00:00:00Z`);
    const key = keyFn(date);
    const group = groups.get(key) ?? { total: 0, count: 0, lastDate: date };
    group.total += entry.value;
    group.count += 1;
    group.lastDate = date;
    groups.set(key, group);
  }

  return groups;
}

function toTrendPoints(
  groups: Map<string, EntryGroup>,
  pointCount: number,
  formatLabel: (date: Date) => string,
): TrendPoint[] {
  const recentKeys = [...groups.keys()].slice(-pointCount);
  return recentKeys.map((key) => {
    const group = groups.get(key)!;
    return {
      label: formatLabel(group.lastDate),
      value: Math.round((group.total / group.count) * 10) / 10,
    };
  });
}

/** Agregasi entri harian/mingguan menjadi titik data mingguan (rata-rata per minggu ISO). */
export function aggregateWeekly(entries: KpiEntry[], weeksCount: number): TrendPoint[] {
  const groups = groupEntries(entries, isoWeekKey);
  return toTrendPoints(groups, weeksCount, (date) => shortDateFormatter.format(date));
}

/** Agregasi entri harian/mingguan menjadi titik data bulanan (rata-rata per bulan kalender). */
export function aggregateMonthly(entries: KpiEntry[], monthsCount: number): TrendPoint[] {
  const groups = groupEntries(entries, monthKey);
  return toTrendPoints(groups, monthsCount, (date) => shortMonthFormatter.format(date));
}
