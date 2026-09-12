import Link from "next/link";
import { notFound } from "next/navigation";
import { kpiById } from "@/lib/kpi-data";

export default async function IsiAngkaPage({ params }: { params: Promise<{ kpiId: string }> }) {
  const { kpiId } = await params;
  const kpi = kpiById(kpiId);

  if (!kpi) notFound();

  return (
    <div className="flex flex-1 flex-col gap-4 bg-zinc-50 px-4 py-6 sm:px-8 dark:bg-black">
      <Link href="/" className="text-xs text-zinc-500 hover:underline dark:text-zinc-400">
        &larr; Kembali ke dashboard
      </Link>
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Isi Angka: {kpi.name}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Target: {kpi.targetLabel}</p>
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        Form input nilai KPI (nilai, periode, catatan, riwayat perubahan) akan tersedia di sini.
      </div>
    </div>
  );
}
