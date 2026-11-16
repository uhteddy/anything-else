import DrawerSideBar from "@/lib/components/DrawerSideBar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-base-200">
      <DrawerSideBar />
      <div className="flex-1 px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
