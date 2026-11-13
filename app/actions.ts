"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createEmployee,
  removeEmployee,
  resetEmployees,
  updateEmployee,
} from "@/lib/store";
import { validateEmployee } from "@/lib/types";

export type SaveResult = { errors: string[] };

/** 社員を登録(id が null)または更新する。成功すると詳細ページへ移動する。 */
export async function saveEmployee(
  id: string | null,
  input: unknown,
): Promise<SaveResult> {
  const checked = validateEmployee(input);
  if (!checked.ok) return { errors: checked.errors };

  const saved =
    id === null
      ? await createEmployee(checked.value)
      : await updateEmployee(id, checked.value);
  if (!saved) {
    return { errors: ["この社員は既に削除されています。一覧に戻ってください。"] };
  }

  revalidatePath("/", "layout");
  redirect(`/employees/${saved.id}`);
}

export async function deleteEmployee(id: string): Promise<void> {
  await removeEmployee(id);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetData(): Promise<void> {
  await resetEmployees();
  revalidatePath("/", "layout");
  redirect("/");
}
