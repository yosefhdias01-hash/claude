import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { KpiEntriesProvider } from "@/contexts/kpi-entries-context";
import { CurrentUserProvider } from "@/contexts/current-user-context";
import { PeriodFilterProvider } from "@/contexts/period-filter-context";
import { DepartmentFilterProvider } from "@/contexts/department-filter-context";

export const metadata: Metadata = {
  title: "Dashboard KPI Divisi",
  description: "Dashboard capaian KPI per divisi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* PeriodFilterProvider & DepartmentFilterProvider memakai useSearchParams
            (baca/simpan filter di URL), yang mensyaratkan batas Suspense. */}
        <Suspense>
          <CurrentUserProvider>
            <DepartmentFilterProvider>
              <PeriodFilterProvider>
                <KpiEntriesProvider>{children}</KpiEntriesProvider>
              </PeriodFilterProvider>
            </DepartmentFilterProvider>
          </CurrentUserProvider>
        </Suspense>
      </body>
    </html>
  );
}
