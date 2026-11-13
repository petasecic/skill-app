import Link from "next/link";

import { button } from "./ui/styles";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        この社員は削除されたか、URLが正しくない可能性があります。
      </p>
      <Link href="/" className={button}>
        一覧へ戻る
      </Link>
    </div>
  );
}
