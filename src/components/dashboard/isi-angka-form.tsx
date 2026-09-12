"use client";

import { useState, type FormEvent } from "react";
import type { Kpi } from "@/types/kpi";
import { useAddKpiEntry } from "@/contexts/kpi-entries-context";
import { useCurrentUser } from "@/contexts/current-user-context";
import { MOCK_ENTRIES_REFERENCE_DATE } from "@/lib/mock-entries";
import { formatKpiValue } from "@/lib/kpi-metrics";
import {
  parseFormValue,
  validateIsiAngkaForm,
  type IsiAngkaFormErrors,
  type IsiAngkaFormValues,
} from "@/lib/kpi-entry-validation";

export function IsiAngkaForm({ kpi }: { kpi: Kpi }) {
  const addEntry = useAddKpiEntry();
  const { currentUser } = useCurrentUser();
  const [values, setValues] = useState<IsiAngkaFormValues>({
    value: "",
    recordedAt: MOCK_ENTRIES_REFERENCE_DATE,
    note: "",
  });
  const [errors, setErrors] = useState<IsiAngkaFormErrors>({});
  const [lastSaved, setLastSaved] = useState<{ value: number; recordedAt: string } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateIsiAngkaForm(values, kpi, MOCK_ENTRIES_REFERENCE_DATE);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const numericValue = parseFormValue(values.value);
    addEntry(kpi, {
      value: numericValue,
      recordedAt: values.recordedAt,
      note: values.note.trim() || undefined,
      changedBy: currentUser.name,
    });

    setLastSaved({ value: numericValue, recordedAt: values.recordedAt });
    setValues((current) => ({ ...current, value: "", note: "" }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="entry-value">
          Nilai ({kpi.valueUnit})
        </label>
        <input
          id="entry-value"
          type="text"
          inputMode="decimal"
          placeholder={`Contoh: ${kpi.targetValue}`}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          value={values.value}
          onChange={(event) => setValues((current) => ({ ...current, value: event.target.value }))}
        />
        {errors.value && <p className="text-xs text-red-600 dark:text-red-400">{errors.value}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="entry-date">
          Tanggal
        </label>
        <input
          id="entry-date"
          type="date"
          max={MOCK_ENTRIES_REFERENCE_DATE}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          value={values.recordedAt}
          onChange={(event) => setValues((current) => ({ ...current, recordedAt: event.target.value }))}
        />
        {errors.recordedAt && <p className="text-xs text-red-600 dark:text-red-400">{errors.recordedAt}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400" htmlFor="entry-note">
          Catatan (opsional)
        </label>
        <textarea
          id="entry-note"
          rows={3}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          value={values.note}
          onChange={(event) => setValues((current) => ({ ...current, note: event.target.value }))}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Simpan
      </button>

      {lastSaved && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          Tersimpan: {formatKpiValue(lastSaved.value, kpi.valueUnit)} pada {lastSaved.recordedAt}.
        </p>
      )}
    </form>
  );
}
