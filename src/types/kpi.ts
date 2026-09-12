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
}
