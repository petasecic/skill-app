import { connection } from "next/server";
import { Suspense } from "react";

import { getEmployees } from "@/lib/store";
import { formOptions } from "@/lib/options";

import { EmployeeForm } from "../../ui/employee-form";
import { muted } from "../../ui/styles";

export default function NewEmployeePage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">社員を登録</h1>
      <Suspense fallback={<p className={muted}>読み込み中…</p>}>
        <NewForm />
      </Suspense>
    </div>
  );
}

async function NewForm() {
  await connection();
  const employees = await getEmployees();
  return <EmployeeForm {...formOptions(employees)} />;
}
