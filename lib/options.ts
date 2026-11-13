import type { Employee } from "./types";

const collator = new Intl.Collator("ja");

/** 入力フォームの候補(登録済みのスキル名と部署名)を作る。 */
export function formOptions(employees: Employee[]) {
  const knownSkills = [
    ...new Set(
      employees.flatMap((e) => [
        ...e.skills.map((s) => s.name),
        ...e.projects.flatMap((p) => p.skills),
      ]),
    ),
  ].sort(collator.compare);
  const knownDepartments = [...new Set(employees.map((e) => e.department))].sort(
    collator.compare,
  );
  return { knownSkills, knownDepartments };
}
