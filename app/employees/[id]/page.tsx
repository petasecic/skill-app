import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getEmployee } from "@/lib/store";
import { LEVEL_LABELS } from "@/lib/types";

import { DeleteButton } from "../../ui/action-buttons";
import { LevelDots } from "../../ui/level";
import { button, card, chip, muted } from "../../ui/styles";

export default function EmployeePage(props: PageProps<"/employees/[id]">) {
  return (
    <div className="flex flex-col gap-5">
      <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← 一覧へ戻る
      </Link>
      <Suspense fallback={<p className={muted}>読み込み中…</p>}>
        <EmployeeDetail params={props.params} />
      </Suspense>
    </div>
  );
}

function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  return `${year}年${Number(month)}月`;
}

async function EmployeeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await getEmployee(id);
  if (!employee) notFound();

  const skills = [...employee.skills].sort((a, b) => b.level - a.level);
  const projects = [...employee.projects].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{employee.name}</h1>
          <p className={muted}>
            {employee.department}
            {employee.title ? ` / ${employee.title}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/employees/${employee.id}/edit`} className={button}>
            編集
          </Link>
          <DeleteButton id={employee.id} name={employee.name} />
        </div>
      </div>

      <section className={card}>
        <h2 className="mb-3 text-base font-semibold">スキル</h2>
        {skills.length === 0 ? (
          <p className={muted}>まだ登録されていません。</p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {skills.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3 py-2">
                <span className="text-sm font-medium">{s.name}</span>
                <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <LevelDots level={s.level} />
                  {LEVEL_LABELS[s.level]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={card}>
        <h2 className="mb-3 text-base font-semibold">これまで経験した仕事</h2>
        {projects.length === 0 ? (
          <p className={muted}>まだ登録されていません。</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {projects.map((p) => (
              <li
                key={`${p.name}-${p.start}`}
                className="border-l-2 border-blue-500 pl-4"
              >
                <p className="text-sm font-semibold">{p.name}</p>
                <p className={muted}>
                  {formatMonth(p.start)} 〜 {p.end ? formatMonth(p.end) : "現在"}
                  {p.role ? ` ・ ${p.role}` : ""}
                </p>
                {p.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.skills.map((s) => (
                      <span key={s} className={chip}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
