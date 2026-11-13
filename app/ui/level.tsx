import { LEVEL_LABELS, LEVELS, type Level } from "@/lib/types";

/** レベルを ●●●○ の形で表示する。 */
export function LevelDots({ level }: { level: Level }) {
  return (
    <span
      role="img"
      aria-label={`レベル${level}: ${LEVEL_LABELS[level]}`}
      title={LEVEL_LABELS[level]}
      className="inline-flex gap-0.5"
    >
      {LEVELS.map((n) => (
        <span
          key={n}
          className={`h-1.5 w-1.5 rounded-full ${
            n <= level ? "bg-blue-600 dark:bg-blue-400" : "bg-zinc-300 dark:bg-zinc-700"
          }`}
        />
      ))}
    </span>
  );
}
