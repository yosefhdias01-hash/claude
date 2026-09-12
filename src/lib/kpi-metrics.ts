import type { Kpi } from "@/types/kpi";

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
