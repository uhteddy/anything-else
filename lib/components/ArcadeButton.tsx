import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "neutral";
type Size = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
};

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

export type ArcadeButtonProps = LinkProps | ButtonProps;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "btn-primary border-b-4 border-primary-content/30 font-extrabold tracking-wide active:translate-y-1 active:border-b-0",
  secondary:
    "btn-secondary border-b-4 border-secondary-content/30 font-extrabold tracking-wide active:translate-y-1 active:border-b-0",
  neutral:
    "border-2 border-base-300 border-b-4 bg-base-100 font-bold active:translate-y-0.5 active:border-b-2",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "btn-md",
  lg: "btn-lg text-lg",
};

export default function ArcadeButton(props: ArcadeButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    block = false,
    className = "",
  } = props;

  const classes = [
    "btn transition-all duration-75",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    block ? "btn-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href !== undefined) {
    if (props.external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    children: _c,
    variant: _v,
    size: _s,
    block: _b,
    className: _cn,
    ...buttonAttrs
  } = props;
  void _c;
  void _v;
  void _s;
  void _b;
  void _cn;

  return (
    <button className={classes} {...buttonAttrs}>
      {children}
    </button>
  );
}
