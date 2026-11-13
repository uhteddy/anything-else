import DrawerSide from "@/lib/components/DrawerSideBar";

export default function DocsLayout({ children, }: { children: React.ReactNode }) {
  return (
    <div className="drawer drawer-open">
        <input type="checkbox" className="drawer-toggle" />
        <div className="drawer-content text-center ml-56">
            {children}
        </div>
        <DrawerSide />
    </div>
  );
}