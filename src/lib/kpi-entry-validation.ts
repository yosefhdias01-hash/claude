import type { Kpi } from "@/types/kpi";

export interface IsiAngkaFormValues {
  value: string;
  recordedAt: string;
  note: string;
}

export interface IsiAngkaFormErrors {
  value?: string;
  recordedAt?: string;
}

/**
 * Validasi form Isi Angka Manual (§7.4 PRD): nilai harus angka valid dan
 * masuk akal untuk satuan KPI-nya (mis. persentase tidak boleh > 100%),
 * tanggal wajib diisi dan tidak boleh di masa depan.
 */
export function validateIsiAngkaForm(
  values: IsiAngkaFormValues,
  kpi: Pick<Kpi, "valueUnit">,
  today: string,
): IsiAngkaFormErrors {
  const errors: IsiAngkaFormErrors = {};

  const trimmedValue = values.value.trim();
  const numericValue = Number(trimmedValue.replace(",", "."));

  if (trimmedValue === "" || Number.isNaN(numericValue)) {
    errors.value = "Nilai harus berupa angka.";
  } else if (numericValue < 0) {
    errors.value = "Nilai tidak boleh negatif.";
  } else if (kpi.valueUnit === "%" && numericValue > 100) {
    errors.value = "Nilai persentase tidak boleh lebih dari 100%.";
  }

  if (!values.recordedAt) {
    errors.recordedAt = "Tanggal wajib diisi.";
  } else if (values.recordedAt > today) {
    errors.recordedAt = "Tanggal tidak boleh di masa depan.";
  }

  return errors;
}

export function parseFormValue(value: string): number {
  return Number(value.trim().replace(",", "."));
}
