"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Kpi } from "@/types/kpi";
import { formatKpiValue } from "@/lib/kpi-metrics";
import { monthlyTrend, weeklyTrend } from "@/lib/mock-trend";

type Granularity = "mingguan" | "bulanan";

const GRANULARITY_OPTIONS: Granularity[] = ["mingguan", "bulanan"];

export function TrendChart({ kpis }: { kpis: Kpi[] }) {
  const [selectedKpiId, setSelectedKpiId] = useState(kpis[0]?.id ?? "");
  const [granularity, setGranularity] = useState<Granularity>("mingguan");

  const selectedKpi = kpis.find((kpi) => kpi.id === selectedKpiId) ?? kpis[0];
  const data = useMemo(() => {
    if (!selectedKpi) return [];
    return granularity === "mingguan" ? weeklyTrend(selectedKpi) : monthlyTrend(selectedKpi);
  }, [selectedKpi, granularity]);

  if (!selectedKpi) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="trend-kpi-select">
            Grafik Tren KPI
          </label>
          <select
            id="trend-kpi-select"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            value={selectedKpi.id}
            onChange={(event) => setSelectedKpiId(event.target.value)}
          >
            {kpis.map((kpi) => (
              <option key={kpi.id} value={kpi.id}>
                {kpi.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
          {GRANULARITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGranularity(option)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${
                granularity === option
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={48} />
            <Tooltip formatter={(value) => formatKpiValue(Number(value), selectedKpi.valueUnit)} />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
