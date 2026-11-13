"use client";

import { useTransition } from "react";

import { deleteEmployee, resetData } from "@/app/actions";

import { dangerButton, smallButton } from "./styles";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className={dangerButton}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`「${name}」さんを削除します。元に戻せません。よろしいですか?`)) {
          return;
        }
        startTransition(() => deleteEmployee(id));
      }}
    >
      {pending ? "削除中…" : "削除"}
    </button>
  );
}

export function ResetButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className={smallButton}
      disabled={pending}
      onClick={() => {
        if (
          !window.confirm(
            "登録・編集した内容をすべて破棄して、最初の架空データ(10人)に戻します。よろしいですか?",
          )
        ) {
          return;
        }
        startTransition(() => resetData());
      }}
    >
      {pending ? "戻しています…" : "初期データに戻す"}
    </button>
  );
}
