"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GamepadIcon, MenuIcon } from "@/lib/components/game/icons";

// Links shown in the game navbar. About and Help point at the existing
// /project pages rather than creating duplicate routes.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/project/about_us" },
  { label: "Help", href: "/project/docs" },
] as const;

const PLAY_NOW_HREF = "/join";

export default function GameNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-field text-xl font-black text-base-content focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
            <GamepadIcon className="size-7" />
          </span>
          Anything Else
        </Link>

        {/* Desktop and tablet links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40 ${
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-base-content/80 hover:bg-secondary/60 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href={PLAY_NOW_HREF} className="btn btn-game btn-sm ml-2 rounded-full px-5">
            Play Now
          </Link>
        </div>

        {/* Mobile menu. The key resets (closes) the menu after navigating. */}
        <details key={pathname} className="dropdown dropdown-end sm:hidden">
          <summary className="btn btn-ghost btn-square" aria-label="Open menu">
            <MenuIcon />
          </summary>
          <ul className="menu dropdown-content z-50 mt-2 w-52 gap-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-soft">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`font-bold ${isActive ? "bg-secondary text-primary" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-1">
              <Link href={PLAY_NOW_HREF} className="btn btn-game btn-sm rounded-full">
                Play Now
              </Link>
            </li>
          </ul>
        </details>
      </nav>
    </header>
  );
}
