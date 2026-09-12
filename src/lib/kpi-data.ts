import type { Department, DepartmentId, Kpi, Role } from "@/types/kpi";

export const departments: Department[] = [
  { id: "digital-marketing", name: "Digital Marketing" },
  { id: "multimedia", name: "Multimedia" },
];

export const roles: Role[] = [
  { id: "paid-ads-specialist", departmentId: "digital-marketing", name: "Paid Ads Specialist", active: true },
  { id: "social-media-specialist", departmentId: "digital-marketing", name: "Social Media Specialist", active: true },
  { id: "content-creator", departmentId: "digital-marketing", name: "Content Creator", active: true },
  { id: "kol-specialist", departmentId: "digital-marketing", name: "KOL Specialist", active: false },
  { id: "videografer", departmentId: "multimedia", name: "Videografer", active: true },
  { id: "design-grafis", departmentId: "multimedia", name: "Design Grafis", active: true },
];

export const kpis: Kpi[] = [
  // Paid Ads Specialist
  { id: "sales", roleId: "paid-ads-specialist", name: "Sales", unit: "juta/bulan", targetLabel: "600 juta/bulan", direction: "tinggi-baik" },
  { id: "warm-leads", roleId: "paid-ads-specialist", name: "Warm Leads", unit: "% dari leads baru", targetLabel: "min. 50% dari leads baru", direction: "tinggi-baik" },
  { id: "mql", roleId: "paid-ads-specialist", name: "MQL", unit: "MQL/bulan", targetLabel: "min. 50 MQL/bulan (Jul–Des)", direction: "tinggi-baik" },
  { id: "cost-per-booking-fee", roleId: "paid-ads-specialist", name: "Cost per Booking Fee", unit: "juta/bulan", targetLabel: "maks. 2,5 juta/bulan", direction: "rendah-baik" },
  { id: "kenaikan-anggaran-iklan", roleId: "paid-ads-specialist", name: "Kontrol Kenaikan Anggaran Iklan", unit: "% dari spending limit", targetLabel: "maks. 10%/bulan", direction: "rendah-baik" },
  { id: "cost-per-mql", roleId: "paid-ads-specialist", name: "Cost per MQL", unit: "Rp/MQL/bulan", targetLabel: "maks. Rp350.000/MQL (Agu–Des)", direction: "rendah-baik" },

  // Social Media Specialist
  { id: "rata-rata-view-organik", roleId: "social-media-specialist", name: "Total Rata-rata View (Organik)", unit: "view/bulan", targetLabel: "min. 100K seluruh platform/bulan", direction: "tinggi-baik" },
  { id: "interaksi-non-followers", roleId: "social-media-specialist", name: "Total Interaksi Non-Followers", unit: "% per platform/bulan", targetLabel: "min. 60% per platform/bulan", direction: "tinggi-baik" },
  { id: "interaksi-audience", roleId: "social-media-specialist", name: "Interaksi dengan Audience", unit: "%", targetLabel: "100%", direction: "tinggi-baik" },

  // Content Creator
  { id: "total-proper-konten", roleId: "content-creator", name: "Total Proper Konten", unit: "% di semua outlet", targetLabel: "100% di semua outlet", direction: "tinggi-baik" },
  { id: "brief-konten-terupload", roleId: "content-creator", name: "Brief Konten Terupload", unit: "brief/bulan", targetLabel: "min. 12 brief/bulan", direction: "tinggi-baik" },

  // Videografer
  { id: "produksi-video-tanpa-revisi-mayor", roleId: "videografer", name: "Produksi Video Tanpa Revisi Mayor", unit: "% dari total video/bulan", targetLabel: "75% dari total video/bulan", direction: "tinggi-baik" },
  { id: "revisi-video-mayor", roleId: "videografer", name: "Revisi Video Mayor", unit: "% dari total video/bulan", targetLabel: "≤ 10% dari total video/bulan", direction: "rendah-baik" },
  { id: "kepatuhan-guideline-video", roleId: "videografer", name: "Kepatuhan terhadap Guideline", unit: "% patuh", targetLabel: "min. 90% patuh", direction: "tinggi-baik" },
  { id: "video-selesai-sesuai-deadline", roleId: "videografer", name: "Project Video Selesai Sesuai Deadline", unit: "% project", targetLabel: "min. 90% project", direction: "tinggi-baik" },

  // Design Grafis
  { id: "output-desain-sesuai-guideline", roleId: "design-grafis", name: "Output Desain Sesuai Guideline", unit: "% sesuai", targetLabel: "min. 90% sesuai", direction: "tinggi-baik" },
  { id: "kejelasan-pesan-bisnis", roleId: "design-grafis", name: "Kejelasan Pesan Bisnis Sesuai Brief", unit: "skor per desain", targetLabel: "≥ 4 per desain", direction: "tinggi-baik" },
  { id: "kualitas-visual", roleId: "design-grafis", name: "Kualitas Visual", unit: "skor per desain", targetLabel: "≥ 9 per desain", direction: "tinggi-baik" },
  { id: "rata-rata-putaran-revisi", roleId: "design-grafis", name: "Rata-rata Putaran Revisi sampai Final", unit: "putaran per desain", targetLabel: "≤ 2 putaran per desain", direction: "rendah-baik" },
];

export function rolesByDepartment(departmentId: DepartmentId): Role[] {
  return roles.filter((role) => role.departmentId === departmentId);
}

export function kpisByRole(roleId: string): Kpi[] {
  return kpis.filter((kpi) => kpi.roleId === roleId);
}
