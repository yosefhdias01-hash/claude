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

/**
 * Satu entri nilai KPI pada tanggal tertentu — bentuk data yang nantinya
 * disimpan oleh fitur Isi Angka Manual (§7.4 PRD). Entri bisa dicatat
 * harian atau mingguan tergantung kadensi KPI-nya.
 */
export interface KpiEntry {
  id: string;
  kpiId: string;
  value: number;
  /** Tanggal periode data, format ISO "YYYY-MM-DD" (mis. tanggal capaian dilaporkan). */
  recordedAt: string;
  note?: string;
  /**
   * Audit trail (§7.4 PRD, wajib untuk setiap perubahan): siapa yang
   * membuat/mengubah entri ini dan kapan aksi itu terjadi — berbeda dari
   * `recordedAt` yang merupakan tanggal periode datanya.
   */
  changedBy: string;
  /** Waktu perubahan, ISO 8601 timestamp. */
  changedAt: string;
}

