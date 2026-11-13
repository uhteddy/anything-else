'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image'

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
        <div className="navbar border-b sticky top-0 bg-base-100 z-100">
            <div className="navbar-start">
                Anything Else
            </div>
            <div className="navbar-center tabs tabs-border">
                {
                    NAV_PROPS.map((prop) =>
                            <Link key={prop.string} href={prop.link!} className={`tab ${isActiveLink(prop.link, pathname) ? 'tab-active' : ''} justify-center text-center`}>
                                {prop.string}
                            </Link>
                        )
                }
            </div>
            <div className="navbar-end">
                <a href="https://github.com/uhteddy/anything-else">
                    <Image
                        src="/svg/GitHub_Invertocat_Black.svg"
                        alt="GitHub"
                        width="32"
                        height="32"
                        className="dark:invert"
                    />
                </a>
            </div>
        </div>
    );
}