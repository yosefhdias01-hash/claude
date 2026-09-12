import type { Kpi, KpiDirection } from "@/types/kpi";

export const KPI_DIRECTION_LABEL: Record<KpiDirection, string> = {
  "tinggi-baik": "Tinggi = baik",
  "rendah-baik": "Rendah = baik",
};

export const KPI_DIRECTION_ARROW: Record<KpiDirection, string> = {
  "tinggi-baik": "▲",
  "rendah-baik": "▼",
};

export interface KpiAchievement {
  /** Persentase pencapaian terhadap target, sudah memperhatikan arah KPI. */
  percentage: number;
  /**
   * Selisih ke target dalam satuan `valueUnit`. Positif = melampaui target
   * (tinggi-baik) atau masih di bawah batas (rendah-baik); negatif = sebaliknya.
   */
  gap: number;
}

export function computeAchievement(kpi: Kpi): KpiAchievement {
  const { targetValue, currentValue, direction } = kpi;

  if (direction === "tinggi-baik") {
    const percentage = targetValue === 0 ? 0 : (currentValue / targetValue) * 100;
    return { percentage, gap: currentValue - targetValue };
  }

  const percentage = currentValue === 0 ? 100 : (targetValue / currentValue) * 100;
  return { percentage, gap: targetValue - currentValue };
}

export type KpiStatus = "tercapai" | "mendekati" | "dibawah";

const STATUS_THRESHOLD = { tercapai: 100, mendekati: 80 } as const;

export const KPI_STATUS_LABEL: Record<KpiStatus, string> = {
  tercapai: "Tercapai",
  mendekati: "Mendekati",
  dibawah: "Di Bawah Target",
};

/**
 * Status pencapaian berdasarkan persentase yang sudah membalik arah untuk
 * KPI rendah=baik (lihat `computeAchievement`), sehingga ambang batas di
 * bawah ini berlaku sama untuk kedua arah KPI.
 */
export function computeStatus(percentage: number): KpiStatus {
  if (percentage >= STATUS_THRESHOLD.tercapai) return "tercapai";
  if (percentage >= STATUS_THRESHOLD.mendekati) return "mendekati";
  return "dibawah";
}

const numberFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export function formatKpiValue(value: number, valueUnit: string): string {
  const formatted = numberFormatter.format(value);
  return valueUnit === "%" ? `${formatted}%` : `${formatted} ${valueUnit}`;
}

export function formatPercentage(percentage: number): string {
  return `${numberFormatter.format(percentage)}%`;
}

export function formatGap(gap: number, valueUnit: string): string {
  const sign = gap > 0 ? "+" : "";
  return `${sign}${formatKpiValue(gap, valueUnit)}`;
}
