export const LEVELS = [1, 2, 3, 4] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_LABELS: Record<Level, string> = {
  1: "基礎",
  2: "実務で使える",
  3: "一人でできる",
  4: "人に教えられる",
};

export type Skill = {
  name: string;
  level: Level;
};

export type Project = {
  name: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM。空文字は「現在も担当中」 */
  end: string;
  role: string;
  skills: string[];
};

export type EmployeeInput = {
  name: string;
  department: string;
  title: string;
  skills: Skill[];
  projects: Project[];
};

export type Employee = EmployeeInput & {
  id: string;
};

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

function isLevel(value: unknown): value is Level {
  return LEVELS.includes(value as Level);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * 入力内容を検証し、整えた値かエラーメッセージの一覧を返す。
 * サーバー側でも必ず通すので、引数は unknown として扱う。
 */
export function validateEmployee(
  raw: unknown,
): { ok: true; value: EmployeeInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const src = (raw ?? {}) as Record<string, unknown>;

  const name = text(src.name);
  const department = text(src.department);
  const title = text(src.title);
  if (!name) errors.push("氏名を入力してください。");
  if (name.length > 50) errors.push("氏名は50文字以内で入力してください。");
  if (!department) errors.push("部署を入力してください。");

  const skills: Skill[] = [];
  const rawSkills = Array.isArray(src.skills) ? src.skills : [];
  for (const item of rawSkills) {
    const row = (item ?? {}) as Record<string, unknown>;
    const skillName = text(row.name);
    if (!skillName) continue; // 空行は無視する
    if (!isLevel(row.level)) {
      errors.push(`スキル「${skillName}」のレベルを選んでください。`);
      continue;
    }
    if (skills.some((s) => s.name === skillName)) {
      errors.push(`スキル「${skillName}」が重複しています。`);
      continue;
    }
    skills.push({ name: skillName, level: row.level });
  }

  const projects: Project[] = [];
  const rawProjects = Array.isArray(src.projects) ? src.projects : [];
  rawProjects.forEach((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const label = `仕事${index + 1}`;
    const projectName = text(row.name);
    const start = text(row.start);
    const end = text(row.end);
    const role = text(row.role);
    const used = Array.isArray(row.skills)
      ? [...new Set(row.skills.map(text).filter(Boolean))]
      : [];

    if (!projectName) errors.push(`${label}: 案件名を入力してください。`);
    if (!MONTH.test(start)) errors.push(`${label}: 開始月を入力してください。`);
    if (end && !MONTH.test(end)) {
      errors.push(`${label}: 終了月の形式が正しくありません。`);
    }
    if (MONTH.test(start) && MONTH.test(end) && end < start) {
      errors.push(`${label}: 終了月が開始月より前になっています。`);
    }
    projects.push({ name: projectName, start, end, role, skills: used });
  });

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { name, department, title, skills, projects } };
}
