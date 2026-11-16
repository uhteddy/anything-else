'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// DrawerSideBarProps allows for easy tab creation and nesting of tabs for the drawer sidebar.
type DrawerSideBarProps = {
  string: string;
  link?: string;
  children?: DrawerSideBarProps[];
};

// DRAWER_PROPS defines each tab and nested tab for drawer sidebar.
export const DRAWER_PROPS: DrawerSideBarProps[] = [
  { string: "Overview", link: "/project/docs" },
  { string: "Background and Description", link: "/project/docs/background_and_description" },
  {
    string: "Assignments",
    link: "/project/docs/assignments",
    children: [
      { string: "Requirements", link: "/project/docs/assignments/requirements" },
      { string: "Use Case Diagrams", link: "/project/docs/assignments/use_case" },
      { string: "Class Diagrams", link: "/project/docs/assignments/class" },
      { string: "Sequence Diagrams", link: "/project/docs/assignments/sequence" },
      { string: "SRS v1", link: "/project/docs/assignments/srs_v1" },
    ],
  },
  {
    string: "Presentation",
    link: "/project/docs/presentation",
    children: [
      { string: "Presentation Slides", link: "/project/docs/presentation/slides" },
      { string: "Presentation Notes", link: "/project/docs/presentation/notes" },
    ],
  },
  { string: "Bibliography", link: "/project/docs/bibliography" },
];

function isActiveLink(link: string | undefined, pathname: string): boolean {
  if (!link) return false;
  return pathname === link;
}

export default function DrawerSideBar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 border-r-2 border-base-300 bg-base-100 p-4">
      <p className="mb-2 px-3 text-xs font-extrabold uppercase tracking-widest opacity-60">
        Documentation
      </p>
      <ul className="menu w-full gap-1 p-0 font-semibold">
        {DRAWER_PROPS.map((prop) => (
          <li key={prop.string}>
            <Link
              href={prop.link!}
              className={
                isActiveLink(prop.link, pathname)
                  ? "menu-active font-black"
                  : ""
              }
            >
              {prop.string}
            </Link>
            {prop.children && (
              <ul className="mt-1 flex flex-col gap-1">
                {prop.children.map((child) => (
                  <li key={child.string}>
                    <Link
                      href={child.link!}
                      className={
                        isActiveLink(child.link, pathname)
                          ? "menu-active font-black"
                          : ""
                      }
                    >
                      {child.string}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
