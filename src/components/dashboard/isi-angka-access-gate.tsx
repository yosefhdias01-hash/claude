"use client";

import type { Kpi } from "@/types/kpi";
import { useCurrentUser } from "@/contexts/current-user-context";
import { canFillKpi } from "@/lib/access";
import { IsiAngkaForm } from "@/components/dashboard/isi-angka-form";
import { EntryHistory } from "@/components/dashboard/entry-history";

/**
 * Menjaga halaman Isi Angka Manual di level halaman itu sendiri (bukan
 * cuma menyembunyikan tautannya di dashboard), supaya navigasi langsung ke
 * URL-nya tetap tunduk pada batasan peran & departemen (§7.4 PRD).
 */
export function IsiAngkaAccessGate({ kpi }: { kpi: Kpi }) {
  const { currentUser } = useCurrentUser();

  if (!canFillKpi(currentUser, kpi)) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        Anda ({currentUser.name}) tidak berhak mengisi angka untuk KPI ini.
      </div>
    );
  }

  return (
    <>
      <IsiAngkaForm kpi={kpi} />
      <EntryHistory kpi={kpi} />
    </>
  );
}
