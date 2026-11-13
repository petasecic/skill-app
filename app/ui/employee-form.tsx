"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { saveEmployee } from "@/app/actions";
import {
  LEVEL_LABELS,
  LEVELS,
  validateEmployee,
  type Employee,
  type Level,
} from "@/lib/types";

import { button, card, input, label, muted, primaryButton, smallButton } from "./styles";

type SkillRow = { key: string; name: string; level: Level };
type ProjectRow = {
  key: string;
  name: string;
  start: string;
  end: string;
  role: string;
  skills: string[];
};

let sequence = 0;
const nextKey = () => `row-${sequence++}`;

type FormProps = {
  employee?: Employee;
  knownSkills: string[];
  knownDepartments: string[];
};

/**
 * Next.js は移動前のページの入力内容を保持する。登録・編集フォームは
 * 開くたびに最新の内容から始めたいので、新しく開いたときだけ作り直す
 * (ブラウザの「戻る」では入力途中の内容が残る)。
 */
export function EmployeeForm(props: FormProps) {
  const { bfcacheId } = useRouter();
  return <EmployeeFormFields key={bfcacheId} {...props} />;
}

function EmployeeFormFields({ employee, knownSkills, knownDepartments }: FormProps) {
  const [name, setName] = useState(employee?.name ?? "");
  const [department, setDepartment] = useState(employee?.department ?? "");
  const [title, setTitle] = useState(employee?.title ?? "");
  const [skills, setSkills] = useState<SkillRow[]>(() =>
    employee
      ? employee.skills.map((s) => ({ key: nextKey(), ...s }))
      : [{ key: nextKey(), name: "", level: 2 }],
  );
  const [projects, setProjects] = useState<ProjectRow[]>(() =>
    (employee?.projects ?? []).map((p) => ({ key: nextKey(), ...p })),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const formId = useId();

  const cancelHref = employee ? `/employees/${employee.id}` : "/";

  // 仕事で「使ったスキル」として選べる候補: 登録済みスキル + この画面で入力中のスキル
  const skillChoices = [
    ...new Set([
      ...skills.map((s) => s.name.trim()).filter(Boolean),
      ...projects.flatMap((p) => p.skills),
      ...knownSkills,
    ]),
  ];

  function updateSkill(key: string, patch: Partial<SkillRow>) {
    setSkills((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function updateProject(key: string, patch: Partial<ProjectRow>) {
    setProjects((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function toggleProjectSkill(row: ProjectRow, skill: string) {
    updateProject(row.key, {
      skills: row.skills.includes(skill)
        ? row.skills.filter((s) => s !== skill)
        : [...row.skills, skill],
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      name,
      department,
      title,
      skills: skills.map(({ name, level }) => ({ name, level })),
      projects: projects.map(({ name, start, end, role, skills }) => ({
        name,
        start,
        end,
        role,
        skills,
      })),
    };

    const checked = validateEmployee(payload);
    if (!checked.ok) {
      setErrors(checked.errors);
      return;
    }
    setErrors([]);
    startTransition(async () => {
      // 成功時はサーバー側で詳細ページへ移動するので、戻り値があるのは失敗時だけ。
      const result = await saveEmployee(employee?.id ?? null, checked.value);
      if (result?.errors) setErrors(result.errors);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <section className={card}>
        <h2 className="mb-4 text-base font-semibold">基本情報</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor={`${formId}-name`}>
              氏名(必須)
            </label>
            <input
              id={`${formId}-name`}
              className={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 山田 花子"
              autoComplete="off"
            />
          </div>
          <div>
            <label className={label} htmlFor={`${formId}-department`}>
              部署(必須)
            </label>
            <input
              id={`${formId}-department`}
              className={input}
              list={`${formId}-department-options`}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="例: 開発部"
              autoComplete="off"
            />
            <datalist id={`${formId}-department-options`}>
              {knownDepartments.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={label} htmlFor={`${formId}-title`}>
              役職
            </label>
            <input
              id={`${formId}-title`}
              className={input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: メンバー"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-1 text-base font-semibold">スキル</h2>
        <p className={`mb-4 ${muted}`}>
          候補から選ぶか、新しいスキル名を直接入力できます。
        </p>
        <datalist id={`${formId}-skill-options`}>
          {knownSkills.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <div className="flex flex-col gap-3">
          {skills.map((row, index) => (
            <div key={row.key} className="flex flex-wrap items-center gap-2">
              <input
                aria-label={`スキル${index + 1}の名前`}
                className={`${input} min-w-40 flex-1`}
                list={`${formId}-skill-options`}
                value={row.name}
                onChange={(e) => updateSkill(row.key, { name: e.target.value })}
                placeholder="スキル名"
                autoComplete="off"
              />
              <select
                aria-label={`スキル${index + 1}のレベル`}
                className={`${input} w-44 flex-none`}
                value={row.level}
                onChange={(e) =>
                  updateSkill(row.key, { level: Number(e.target.value) as Level })
                }
              >
                {LEVELS.map((n) => (
                  <option key={n} value={n}>
                    {n}: {LEVEL_LABELS[n]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={smallButton}
                onClick={() => setSkills((rows) => rows.filter((r) => r.key !== row.key))}
              >
                削除
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className={`mt-4 ${smallButton}`}
          onClick={() =>
            setSkills((rows) => [...rows, { key: nextKey(), name: "", level: 2 }])
          }
        >
          + スキルを追加
        </button>
      </section>

      <section className={card}>
        <h2 className="mb-4 text-base font-semibold">これまで経験した仕事</h2>
        {projects.length === 0 && (
          <p className={muted}>まだ登録されていません。</p>
        )}
        <div className="flex flex-col gap-4">
          {projects.map((row, index) => (
            <fieldset
              key={row.key}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <legend className="px-1 text-xs font-medium text-zinc-500">
                仕事{index + 1}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor={`${formId}-project${index}-name`}>
                    案件名(必須)
                  </label>
                  <input
                    id={`${formId}-project${index}-name`}
                    className={input}
                    value={row.name}
                    onChange={(e) => updateProject(row.key, { name: e.target.value })}
                    placeholder="例: 在庫管理システムの刷新"
                  />
                </div>
                <div>
                  <label className={label} htmlFor={`${formId}-project${index}-role`}>
                    役割
                  </label>
                  <input
                    id={`${formId}-project${index}-role`}
                    className={input}
                    value={row.role}
                    onChange={(e) => updateProject(row.key, { role: e.target.value })}
                    placeholder="例: 開発リーダー"
                  />
                </div>
                <div>
                  <label className={label} htmlFor={`${formId}-project${index}-start`}>
                    開始月(必須)
                  </label>
                  <input
                    id={`${formId}-project${index}-start`}
                    type="month"
                    className={input}
                    value={row.start}
                    onChange={(e) => updateProject(row.key, { start: e.target.value })}
                    placeholder="2024-04"
                  />
                </div>
                <div>
                  <label className={label} htmlFor={`${formId}-project${index}-end`}>
                    終了月(担当中なら空欄)
                  </label>
                  <input
                    id={`${formId}-project${index}-end`}
                    type="month"
                    className={input}
                    value={row.end}
                    onChange={(e) => updateProject(row.key, { end: e.target.value })}
                    placeholder="2025-03"
                  />
                </div>
              </div>
              <div className="mt-4">
                <span className={label}>使ったスキル(クリックで選択)</span>
                {skillChoices.length === 0 ? (
                  <p className={muted}>先に上の「スキル」を入力してください。</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skillChoices.map((skill) => {
                      const on = row.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleProjectSkill(row, skill)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            on
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                type="button"
                className={`mt-4 ${smallButton}`}
                onClick={() =>
                  setProjects((rows) => rows.filter((r) => r.key !== row.key))
                }
              >
                この仕事を削除
              </button>
            </fieldset>
          ))}
        </div>
        <button
          type="button"
          className={`mt-4 ${smallButton}`}
          onClick={() =>
            setProjects((rows) => [
              ...rows,
              { key: nextKey(), name: "", start: "", end: "", role: "", skills: [] },
            ])
          }
        >
          + 仕事を追加
        </button>
      </section>

      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          <p className="font-semibold">保存できませんでした。次の点を直してください。</p>
          <ul className="mt-2 list-disc pl-5">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" className={primaryButton} disabled={pending}>
          {pending ? "保存中…" : "保存する"}
        </button>
        <Link href={cancelHref} className={button}>
          キャンセル
        </Link>
      </div>
    </form>
  );
}
