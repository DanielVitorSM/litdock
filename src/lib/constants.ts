export const TAG_COLORS = {
  slate: "bg-slate-200 text-slate-700 border-slate-700 hover:bg-slate-200",
  red: "bg-red-200 text-red-700 border-red-700 hover:bg-red-200",
  orange: "bg-orange-200 text-orange-700 border-orange-700 hover:bg-orange-200",
  amber: "bg-amber-200 text-amber-700 border-amber-700 hover:bg-amber-200",
  green: "bg-green-200 text-green-700 border-green-700 hover:bg-green-200",
  emerald: "bg-emerald-200 text-emerald-700 border-emerald-700 hover:bg-emerald-200",
  teal: "bg-teal-200 text-teal-700 border-teal-700 hover:bg-teal-200",
  cyan: "bg-cyan-200 text-cyan-700 border-cyan-700 hover:bg-cyan-200",
  blue: "bg-blue-200 text-blue-700 border-blue-700 hover:bg-blue-200",
  indigo: "bg-indigo-200 text-indigo-700 border-indigo-700 hover:bg-indigo-200",
  violet: "bg-violet-200 text-violet-700 border-violet-700 hover:bg-violet-200",
  purple: "bg-purple-200 text-purple-700 border-purple-700 hover:bg-purple-200",
  fuchsia: "bg-fuchsia-200 text-fuchsia-700 border-fuchsia-700 hover:bg-fuchsia-200",
  pink: "bg-pink-200 text-pink-700 border-pink-700 hover:bg-pink-200",
  rose: "bg-rose-200 text-rose-700 border-rose-700 hover:bg-rose-200",
} as Record<string, string>;

export const TAG_BACKGROUND_COLORS = {
  slate: "bg-slate-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  rose: "bg-rose-500",
} as Record<string, string>;

export const ICON_COLOR_MAP: Record<string, string> = {
  academic: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  media: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  legal: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  reference: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  communication: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  mediaAV: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  data: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  creative: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  institutional: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
}

export type TagColor = keyof typeof TAG_COLORS;

export const DEFAULT_TAG_COLOR: TagColor = 'indigo';  