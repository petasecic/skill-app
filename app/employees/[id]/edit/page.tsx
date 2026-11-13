import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getEmployees } from "@/lib/store";
import { formOptions } from "@/lib/options";

import { EmployeeForm } from "../../../ui/employee-form";
import { muted } from "../../../ui/styles";

export default function EditEmployeePage(props: PageProps<"/employees/[id]/edit">) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">社員情報を編集</h1>
      <Suspense fallback={<p className={muted}>読み込み中…</p>}>
        <EditForm params={props.params} />
      </Suspense>
    </div>
  );
}

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employees = await getEmployees();
  const employee = employees.find((e) => e.id === id);
  if (!employee) notFound();

  return <EmployeeForm employee={employee} {...formOptions(employees)} />;
}
