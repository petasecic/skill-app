/** 画面全体で使い回す Tailwind のクラス名。 */

const buttonBase =
  "inline-flex items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const button = `${buttonBase} border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800`;

export const primaryButton = `${buttonBase} bg-blue-600 text-white hover:bg-blue-700`;

export const dangerButton = `${buttonBase} border border-red-300 bg-white text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950`;

export const smallButton =
  "inline-flex items-center rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

export const input =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

export const label =
  "mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

export const card =
  "rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";

export const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs dark:border-zinc-700";

export const muted = "text-sm text-zinc-500 dark:text-zinc-400";
