import { connection } from "next/server";
import { Suspense } from "react";

import { getEmployees } from "@/lib/store";

import { ResetButton } from "./ui/action-buttons";
import { EmployeeBrowser } from "./ui/employee-browser";
import { muted } from "./ui/styles";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">社員一覧</h1>
      <Suspense fallback={<p className={muted}>読み込み中…</p>}>
        <EmployeeList />
      </Suspense>
      <footer className="mt-4 flex justify-end">
        <ResetButton />
      </footer>
    </div>
  );
}

async function EmployeeList() {
  // データは保存のたびに変わるので、毎回リクエスト時に読み込む。
  await connection();
  const employees = await getEmployees();
  return <EmployeeBrowser employees={employees} />;
}
