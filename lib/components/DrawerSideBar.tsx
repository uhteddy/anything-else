'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// DrawerSideBarProps allows for easy tab creation and nesting of tabs for the drawer sidebar. Each tab can have a string, an optional link, and optional children which are also DrawerSideBarProps.
type DrawerSideBarProps = {
    string: string;
    link?: string;
    children?: DrawerSideBarProps[];
};

// DRAWER_PROPS defines each tab and nested tab for drawer sidebar.
const DRAWER_PROPS: DrawerSideBarProps[] = [
    { string: "Overview", link: "/project/docs" },
    { string: "Background and Description", link: "/project/docs/background_and_description" },
    { string: "Assignments", link: "/project/docs/assignments",
        children: [
            { string: "Requirements", link: "/project/docs/assignments/requirements" },
            { string: "Use Case Diagrams", link: "/project/docs/assignments/use_case" },
            { string: "Class Diagrams", link: "/project/docs/assignments/class" },
            { string: "Sequence Diagrams", link: "/project/docs/assignments/sequence" },
            { string: "SRS v1", link: "/project/docs/assignments/srs_v1" }
        ]
    },
    { string: "Presentation", link: "/project/docs/presentation",
        children: [
            { string: "Presentation Slides", link: "/project/docs/presentation/slides" },
            { string: "Presentation Notes", link: "/project/docs/presentation/notes"}
        ]
     },
    { string: "Bibliography", link: "/project/docs/bibliography" }
];

// Checks whether or not a link is active based on the pathname. Returns true if the link is active, returns false if not.
// Lets us add the "tab-active" class to the active tab in the drawer sidebar.
function isActiveLink(link: string | undefined, pathname: string): boolean {
    if (!link) return false;
    return pathname === link;
}

export default function DrawerSideBar() {
    const pathname = usePathname();
    return (
        <div className="drawer-side top-16 fixed">
            <ul className="menu">
                {
                    DRAWER_PROPS.map((prop) =>
                        <li key={prop.string}>
                            <Link href={prop.link!} className={`${isActiveLink(prop.link, pathname) ? 'active' : ''}`}>
                                {prop.string}
                            </Link>
                            {prop.children && (
                                <ul>
                                    {prop.children.map((child) => (
                                        <li key={child.string}>
                                            <Link href={child.link!} className={`${isActiveLink(child.link, pathname) ? 'active' : ''}`}>
                                                {child.string}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    )
                }
            </ul>
        </div>
    );
}
