import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { SEED_EMPLOYEES } from "./seed";
import type { Employee, EmployeeInput } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "employees.json");

// 書き込みが同時に走ってファイルが壊れないよう、順番に処理する。
let queue: Promise<unknown> = Promise.resolve();
function inOrder<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task, task);
  queue = result.catch(() => undefined);
  return result;
}

async function writeAll(employees: Employee[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const temp = `${DATA_FILE}.tmp`;
  await writeFile(temp, JSON.stringify(employees, null, 2) + "\n", "utf8");
  await rename(temp, DATA_FILE);
}

async function readAll(): Promise<Employee[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8")) as Employee[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    // 初回はファイルが無いので、架空データで作成する。
    await writeAll(SEED_EMPLOYEES);
    return structuredClone(SEED_EMPLOYEES);
  }
}

export function getEmployees(): Promise<Employee[]> {
  return inOrder(readAll);
}

export async function getEmployee(id: string): Promise<Employee | undefined> {
  return (await getEmployees()).find((e) => e.id === id);
}

export function createEmployee(input: EmployeeInput): Promise<Employee> {
  return inOrder(async () => {
    const employees = await readAll();
    const employee: Employee = { id: `emp-${crypto.randomUUID()}`, ...input };
    await writeAll([...employees, employee]);
    return employee;
  });
}

export function updateEmployee(
  id: string,
  input: EmployeeInput,
): Promise<Employee | undefined> {
  return inOrder(async () => {
    const employees = await readAll();
    if (!employees.some((e) => e.id === id)) return undefined;
    const employee: Employee = { id, ...input };
    await writeAll(employees.map((e) => (e.id === id ? employee : e)));
    return employee;
  });
}

export function removeEmployee(id: string): Promise<void> {
  return inOrder(async () => {
    const employees = await readAll();
    await writeAll(employees.filter((e) => e.id !== id));
  });
}

export function resetEmployees(): Promise<void> {
  return inOrder(() => writeAll(SEED_EMPLOYEES));
}
