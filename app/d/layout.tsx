"use client";

import UpsertUserOnLoad from "@/components/upsertUserOnLoad";
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <UpsertUserOnLoad />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-[50rem] max-w-screen-lg text-center">{children}</div>
      </main>
    </div>
  );
}
