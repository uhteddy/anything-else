'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// NavbarProps allows for easy tab creation and nesting of tabs for the navbar. Each tab can have a string, an optional link, and optional children which are also NavbarProps.
type NavbarProps = {
  string: string;
  link?: string;
  children?: NavbarProps[];
};

// NAV_PROPS defines each tab and nested tab for navbar.
const NAV_PROPS: NavbarProps[] = [
  { string: "Home", link: "/project" },
  { string: "Documentation", link: "/project/docs" },
  { string: "Play Now", link: "/" },
  { string: "About Us", link: "/project/about_us" },
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
    <div className="navbar sticky top-0 z-100 border-b-2 border-base-300 bg-base-100 px-4">
      <div className="navbar-start">
        <Link href="/project" className="text-xl font-black tracking-tight">
          Anything Else?!
        </Link>
      </div>
      <div className="navbar-center tabs tabs-border font-bold">
        {NAV_PROPS.map((prop) => (
          <Link
            key={prop.string}
            href={prop.link!}
            className={`tab ${isActiveLink(prop.link, pathname) ? 'tab-active font-extrabold' : ''} justify-center text-center`}
          >
            {prop.string}
          </Link>
        ))}
      </div>
      <div className="navbar-end">
        <a
          href="https://github.com/uhteddy/anything-else"
          className="btn btn-circle btn-ghost btn-sm"
          aria-label="GitHub repository"
        >
          <Image
            src="/svg/GitHub_Invertocat_Black.svg"
            alt="GitHub"
            width="28"
            height="28"
            className="dark:invert"
          />
        </a>
      </div>
    </div>
  );
}
