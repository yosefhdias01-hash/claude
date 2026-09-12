"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Kpi } from "@/types/kpi";
import { formatKpiValue, formatPercentage } from "@/lib/kpi-metrics";
import {
  monthlyAchievementTrend,
  monthlyTrend,
  weeklyAchievementTrend,
  weeklyTrend,
  type TrendPoint,
} from "@/lib/mock-trend";
import { useEndBoundedKpiEntries, useEndBoundedKpiEntriesGetter } from "@/contexts/kpi-entries-context";

type Granularity = "mingguan" | "bulanan";

const GRANULARITY_OPTIONS: Granularity[] = ["mingguan", "bulanan"];
const COMPARE_LINE_COLORS = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed"];
const MAX_COMPARE_KPIS = 4;

function GranularityToggle({
  granularity,
  onChange,
}: {
  granularity: Granularity;
  onChange: (value: Granularity) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
      {GRANULARITY_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
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
  );
}

function ExtremeDot({
  cx,
  cy,
  payload,
  extremes,
}: {
  cx?: number;
  cy?: number;
  payload?: TrendPoint;
  extremes: { max: number; min: number };
}) {
  if (cx === undefined || cy === undefined || !payload) return null;

  if (payload.value === extremes.max && extremes.max !== extremes.min) {
    return <circle cx={cx} cy={cy} r={5} fill="#16a34a" stroke="white" strokeWidth={1.5} />;
  }
  if (payload.value === extremes.min && extremes.max !== extremes.min) {
    return <circle cx={cx} cy={cy} r={5} fill="#dc2626" stroke="white" strokeWidth={1.5} />;
  }
  return <circle cx={cx} cy={cy} r={3} fill="#2563eb" />;
}

function SingleKpiChart({ kpi, granularity }: { kpi: Kpi; granularity: Granularity }) {
  const entries = useEndBoundedKpiEntries(kpi);
  const data = useMemo(
    () => (granularity === "mingguan" ? weeklyTrend(entries) : monthlyTrend(entries)),
    [entries, granularity],
  );

  const extremes = useMemo(() => {
    const values = data.map((point) => point.value);
    return { max: Math.max(...values), min: Math.min(...values) };
  }, [data]);

  return (
    <>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={48} />
            <Tooltip formatter={(value) => formatKpiValue(Number(value), kpi.valueUnit)} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={(dotProps) => {
                const { key, ...rest } = dotProps;
                return <ExtremeDot key={key} {...rest} extremes={extremes} />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          Tertinggi: {formatKpiValue(extremes.max, kpi.valueUnit)}
        </span>{" "}
        &middot;{" "}
        <span className="font-medium text-red-600 dark:text-red-400">
          Terendah: {formatKpiValue(extremes.min, kpi.valueUnit)}
        </span>
      </p>
    </>
  );
}

function CompareKpiChart({ kpis, granularity }: { kpis: Kpi[]; granularity: Granularity }) {
  const getEntries = useEndBoundedKpiEntriesGetter();
  const data = useMemo(() => {
    if (kpis.length === 0) return [];
    const seriesByKpi = kpis.map((kpi) => {
      const entries = getEntries(kpi);
      return granularity === "mingguan"
        ? weeklyAchievementTrend(entries, kpi)
        : monthlyAchievementTrend(entries, kpi);
    });
    const [firstSeries] = seriesByKpi;
    return firstSeries.map((point, index) => {
      const row: Record<string, number | string> = { label: point.label };
      kpis.forEach((kpi, kpiIndex) => {
        row[kpi.id] = seriesByKpi[kpiIndex][index]?.value ?? 0;
      });
      return row;
    });
  }, [kpis, granularity, getEntries]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={48} unit="%" />
          <Tooltip formatter={(value) => formatPercentage(Number(value))} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {kpis.map((kpi, index) => (
            <Line
              key={kpi.id}
              type="monotone"
              dataKey={kpi.id}
              name={kpi.name}
              stroke={COMPARE_LINE_COLORS[index % COMPARE_LINE_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({ kpis }: { kpis: Kpi[] }) {
  const [selectedKpiId, setSelectedKpiId] = useState(kpis[0]?.id ?? "");
  const [granularity, setGranularity] = useState<Granularity>("mingguan");
  const [compareMode, setCompareMode] = useState(false);
  const [compareKpiIds, setCompareKpiIds] = useState(() => kpis.slice(0, 2).map((kpi) => kpi.id));

  const selectedKpi = kpis.find((kpi) => kpi.id === selectedKpiId) ?? kpis[0];
  const compareKpis = kpis.filter((kpi) => compareKpiIds.includes(kpi.id));

  if (!selectedKpi) return null;

  function toggleCompareKpi(kpiId: string) {
    setCompareKpiIds((current) => {
      if (current.includes(kpiId)) return current.filter((id) => id !== kpiId);
      if (current.length >= MAX_COMPARE_KPIS) return current;
      return [...current, kpiId];
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="trend-kpi-select">
            Grafik Tren KPI
          </label>
          {!compareMode && (
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
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(event) => setCompareMode(event.target.checked)}
            />
            Bandingkan KPI
          </label>
          <GranularityToggle granularity={granularity} onChange={setGranularity} />
        </div>
      </div>

      {compareMode && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-zinc-50 p-2 text-xs dark:bg-zinc-950/50">
          {kpis.map((kpi) => (
            <label key={kpi.id} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={compareKpiIds.includes(kpi.id)}
                onChange={() => toggleCompareKpi(kpi.id)}
              />
              {kpi.name}
            </label>
          ))}
        </div>
      )}

      {compareMode ? (
        compareKpis.length > 0 ? (
          <CompareKpiChart kpis={compareKpis} granularity={granularity} />
        ) : (
          <p className="text-xs text-zinc-400">Pilih minimal satu KPI untuk dibandingkan.</p>
        )
      ) : (
        <SingleKpiChart kpi={selectedKpi} granularity={granularity} />
      )}
    </div>
  );
}
