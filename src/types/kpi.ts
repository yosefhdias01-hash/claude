export type DepartmentId = "digital-marketing" | "multimedia";

export type KpiDirection = "tinggi-baik" | "rendah-baik";

export interface Department {
  id: DepartmentId;
  name: string;
}

export interface Role {
  id: string;
  departmentId: DepartmentId;
  name: string;
  active: boolean;
}

export interface Kpi {
  id: string;
  roleId: string;
  name: string;
  unit: string;
  targetLabel: string;
  direction: KpiDirection;
  /** Nilai target dalam satuan `valueUnit`, dipakai untuk hitung persentase & gap. */
  targetValue: number;
  /** Nilai tercapai bulan berjalan (mock — akan diisi dari fitur Isi Angka Manual). */
  currentValue: number;
  /** Satuan singkat untuk tampilan angka, mis. "%", "juta", "Rp", "MQL", "skor". */
  valueUnit: string;
}

