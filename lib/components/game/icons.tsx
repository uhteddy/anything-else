// Small inline SVG icons for the game UI. They are decorative, so screen
// readers skip them; always pair an icon with visible text or an aria-label.

type IconProps = {
  className?: string;
};

const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function GamepadIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.3 5H6.7a4 4 0 0 0-4 3.6l-.9 8.1a2.5 2.5 0 0 0 4.7 1.4L7.5 16h9l1 2.1a2.5 2.5 0 0 0 4.7-1.4l-.9-8.1a4 4 0 0 0-4-3.6Z"
      />
      <path {...STROKE_PROPS} stroke="white" d="M6 10.5h4M8 8.5v4" />
      <circle cx="15" cy="11.5" r="1.1" fill="white" />
      <circle cx="17.6" cy="9.4" r="1.1" fill="white" />
    </svg>
  );
}

export function UsersIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <circle cx="12" cy="7" r="3.2" />
        <circle cx="5.3" cy="9" r="2.4" />
        <circle cx="18.7" cy="9" r="2.4" />
        <path d="M6.5 20a5.5 5.5 0 0 1 11 0Z" />
        <path d="M1.2 19.5a4.1 4.1 0 0 1 5.9-3.7 7 7 0 0 0-1.9 3.7Z" />
        <path d="M22.8 19.5a4.1 4.1 0 0 0-5.9-3.7 7 7 0 0 1 1.9 3.7Z" />
      </g>
    </svg>
  );
}

export function CrownIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M2.5 7.5 7.3 11.6 12 4l4.7 7.6 4.8-4.1-1.9 10H4.4Z" />
        <rect x="4.4" y="18.5" width="15.2" height="2.5" rx="1" />
      </g>
    </svg>
  );
}

export function ArrowRightIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} strokeWidth={2.5} d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} strokeWidth={2.5} d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function UserIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <circle {...STROKE_PROPS} cx="12" cy="8" r="4" />
      <path {...STROKE_PROPS} d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function BookIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5Z" />
      <path {...STROKE_PROPS} d="M12 6.5v13" />
    </svg>
  );
}

export function LayersIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} d="M12 3 2.5 8 12 13l9.5-5Z" />
      <path {...STROKE_PROPS} d="m2.5 12.5 9.5 5 9.5-5M2.5 16.5l9.5 5 9.5-5" />
    </svg>
  );
}

export function TimerIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <circle {...STROKE_PROPS} cx="12" cy="13.5" r="7.5" />
      <path {...STROKE_PROPS} d="M12 9.5v4l2.5 2M10 2.5h4M18.5 6.5l1.5-1.5" />
    </svg>
  );
}

export function PlusIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} strokeWidth={2.5} d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function PencilIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" />
      <path {...STROKE_PROPS} d="m13.5 6.5 4 4" />
    </svg>
  );
}

export function ArrowUpIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} strokeWidth={2.5} d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ArrowDownIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} strokeWidth={2.5} d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function TrashIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </svg>
  );
}

export function ImageIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect {...STROKE_PROPS} x="3" y="4" width="18" height="16" rx="3" />
      <circle {...STROKE_PROPS} cx="9" cy="10" r="1.75" />
      <path {...STROKE_PROPS} d="m21 16-5-5-9 9" />
    </svg>
  );
}

export function CopyIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect {...STROKE_PROPS} x="8" y="8" width="12" height="12" rx="2.5" />
      <path {...STROKE_PROPS} d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
    </svg>
  );
}

export function CheckIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} strokeWidth={2.75} d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function MenuIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/** Three short "burst" lines used as a celebratory accent next to headings. */
export function BurstIcon({ className = "size-8" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path {...STROKE_PROPS} strokeWidth={2.75} d="M12 3v5M4 7l3.5 3M20 7l-3.5 3" />
    </svg>
  );
}
