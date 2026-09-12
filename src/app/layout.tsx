import type { Metadata } from "next";
import "./globals.css";
import { KpiEntriesProvider } from "@/contexts/kpi-entries-context";

export const metadata: Metadata = {
  title: "Dashboard KPI Divisi",
  description: "Dashboard capaian KPI per divisi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <KpiEntriesProvider>{children}</KpiEntriesProvider>
      </body>
    </html>
  );
}
