'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// NavbarProps allows for easy tab creation and nesting of tabs for the navbar. Each tab can have a string, an optional link, and optional children which are also NavbarProps.
type NavbarProps = {
    string: string;
    link?: string;
    children?: NavbarProps[];
};

// NAV_PROPS defines each tab and nested tab for navbar.
const NAV_PROPS: NavbarProps[] = [
    { string: "Home", link: "/" },
    { string: "Documentation", link: "/docs" },
    {
        string: "Project Assignments",
        children: [
            "Req. and Use Case",
            "Class and Seq. Diagrams",
            "Website Skeleton",
            "SRS v1",
            "UI Prototype"].map((assignment) => ({
                string: assignment,
                link: `/assignments/${assignment.toLowerCase().replace(/\s+/g, '_')}`,
            })),
    },
    { string: "Play Now", link: "/game" },
    { string: "About Us", link: "/about_us" }
];

// Checks whether or not a link is active based on the pathname. Returns true if the link is active, returns false if not.
// Lets us add the "tab-active" class to the active tab in the navbar.
function isActiveLink(link: string | undefined, pathname: string): boolean {
    if (!link) return false;
    return pathname === link;
}

export default function Navbar() {
    const pathname = usePathname();
    return (
        <div className="navbar border-b">
            <div className="navbar-start">
                Anything Else
            </div>
            <div className="navbar-center tabs tabs-border">
                {
                    NAV_PROPS.map((prop) =>
                        // if the prop has children, render a dropdown
                        prop.children ? (
                            <div key={prop.string} className="dropdown dropdown-hover">
                                <div tabIndex={0} role="button" className="tab">
                                    {prop.string}
                                </div>
                                <ul tabIndex={-1} className="dropdown-content menu bg-base-100">
                                    {prop.children.map((child) => (
                                        <li key={child.string}>
                                            <Link href={child.link!} className={`tab ${isActiveLink(child.link, pathname) ? 'tab-active' : ''} justify-center text-center`}>
                                                {child.string}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            // if the prop has no children, render a normal tab
                            <Link key={prop.string} href={prop.link!} className={`tab ${isActiveLink(prop.link, pathname) ? 'tab-active' : ''} justify-center text-center`}>
                                {prop.string}
                            </Link>
                        ))
                }
            </div>
            <div className="navbar-end">
                <a href="https://github.com/uhteddy/anything-else">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" display="inline-block" overflow="visible">
                        <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943">
                        </path>
                    </svg>
                </a>
            </div>
        </div>
    );
}