"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import { LEVEL_LABELS, LEVELS, type Employee, type Level } from "@/lib/types";

import { LevelDots } from "./level";
import { card, chip, input, label, muted, primaryButton, smallButton } from "./styles";

const collator = new Intl.Collator("ja");

export function EmployeeBrowser({ employees }: { employees: Employee[] }) {
  const [keyword, setKeyword] = useState("");
  const [department, setDepartment] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [minLevel, setMinLevel] = useState<Level>(1);
  const formId = useId();

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))].sort(collator.compare),
    [employees],
  );
  const skillNames = useMemo(
    () =>
      [...new Set(employees.flatMap((e) => e.skills.map((s) => s.name)))].sort(
        collator.compare,
      ),
    [employees],
  );

  const results = useMemo(() => {
    const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
    const levelOf = (e: Employee, skill: string) =>
      e.skills.find((s) => s.name === skill)?.level ?? 0;
    const score = (e: Employee) =>
      selected.reduce((sum, skill) => sum + levelOf(e, skill), 0);

    return employees
      .filter((e) => {
        if (department && e.department !== department) return false;
        if (!selected.every((skill) => levelOf(e, skill) >= minLevel)) return false;
        if (words.length === 0) return true;
        const haystack = [
          e.name,
          e.department,
          e.title,
          ...e.skills.map((s) => s.name),
          ...e.projects.flatMap((p) => [p.name, p.role]),
        ]
          .join(" ")
          .toLowerCase();
        return words.every((w) => haystack.includes(w));
      })
      .sort((a, b) => score(b) - score(a));
  }, [employees, keyword, department, selected, minLevel]);

  const hasFilter = keyword !== "" || department !== "" || selected.length > 0;

  function toggleSkill(name: string) {
    setSelected((current) =>
      current.includes(name) ? current.filter((s) => s !== name) : [...current, name],
    );
  }

  function clearFilters() {
    setKeyword("");
    setDepartment("");
    setSelected([]);
    setMinLevel(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <section className={card} aria-label="条件で探す">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">条件で探す</h2>
          <button
            type="button"
            className={smallButton}
            onClick={clearFilters}
            disabled={!hasFilter}
          >
            条件をクリア
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor={`${formId}-keyword`}>
              キーワード(名前・役職・案件名など)
            </label>
            <input
              id={`${formId}-keyword`}
              type="search"
              className={input}
              placeholder="例: 佐藤、在庫管理"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor={`${formId}-department`}>
              部署
            </label>
            <select
              id={`${formId}-department`}
              className={input}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">すべて</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor={`${formId}-minLevel`}>
              選んだスキルのレベル
            </label>
            <select
              id={`${formId}-minLevel`}
              className={input}
              value={minLevel}
              disabled={selected.length === 0}
              onChange={(e) => setMinLevel(Number(e.target.value) as Level)}
            >
              {LEVELS.map((n) => (
                <option key={n} value={n}>
                  {LEVEL_LABELS[n]}
                  {n < 4 ? " 以上" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <span className={label}>
            スキル(複数選ぶと、すべて持っている人だけを表示します)
          </span>
          <div className="flex flex-wrap gap-2">
            {skillNames.map((name) => {
              const on = selected.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleSkill(name)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    on
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <p className="text-sm" aria-live="polite">
          <span className="text-lg font-semibold">{results.length}</span>人
          <span className={`ml-2 ${muted}`}>/ 全{employees.length}人</span>
        </p>
        <Link href="/employees/new" className={primaryButton}>
          + 社員を登録
        </Link>
      </div>

      {results.length === 0 ? (
        <p className={`${card} ${muted}`}>
          条件に合う社員がいません。条件をゆるめてみてください。
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((e) => (
            <li key={e.id}>
              <Link
                href={`/employees/${e.id}`}
                className={`${card} block transition-colors hover:border-blue-500 dark:hover:border-blue-500`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-base font-semibold">{e.name}</span>
                  <span className={muted}>
                    {e.department}
                    {e.title ? ` / ${e.title}` : ""}
                  </span>
                  <span className={`ml-auto ${muted}`}>
                    経験した仕事 {e.projects.length}件
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {e.skills.length === 0 ? (
                    <span className={muted}>スキル未登録</span>
                  ) : (
                    [...e.skills]
                      .sort((a, b) => b.level - a.level)
                      .map((s) => (
                        <span
                          key={s.name}
                          className={`${chip} ${
                            selected.includes(s.name)
                              ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950"
                              : ""
                          }`}
                        >
                          {s.name}
                          <LevelDots level={s.level} />
                        </span>
                      ))
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
