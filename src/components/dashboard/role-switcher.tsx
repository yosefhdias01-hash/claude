"use client";

import { mockUsers } from "@/lib/mock-users";
import type { CurrentUser } from "@/types/user";

export function RoleSwitcher({
  currentUser,
  onChange,
}: {
  currentUser: CurrentUser;
  onChange: (user: CurrentUser) => void;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3 text-xs dark:border-zinc-700 dark:bg-zinc-900/50">
      <label className="font-medium text-zinc-500 dark:text-zinc-400" htmlFor="role-switcher">
        Simulasi login sebagai (sementara, sebelum Supabase Auth di Fase 4)
      </label>
      <select
        id="role-switcher"
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        value={currentUser.id}
        onChange={(event) => {
          const nextUser = mockUsers.find((user) => user.id === event.target.value);
          if (nextUser) onChange(nextUser);
        }}
      >
        {mockUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}
