type ShapeItem = {
  shape: "triangle" | "diamond" | "circle" | "square" | "plus";
  color: string;
  position: string;
  size: string;
  animation: string;
  delay: string;
};

const SHAPES: ShapeItem[] = [
  {
    shape: "triangle",
    color: "text-primary/15",
    position: "top-14 left-[6%]",
    size: "size-24 sm:size-32",
    animation: "animate-arcade-float",
    delay: "0s",
  },
  {
    shape: "diamond",
    color: "text-secondary/15",
    position: "top-20 right-[8%]",
    size: "size-20 sm:size-28",
    animation: "animate-arcade-drift",
    delay: "-1.5s",
  },
  {
    shape: "circle",
    color: "text-accent/20",
    position: "bottom-16 left-[10%]",
    size: "size-20 sm:size-28",
    animation: "animate-arcade-drift",
    delay: "-3s",
  },
  {
    shape: "square",
    color: "text-info/15",
    position: "bottom-20 right-[10%]",
    size: "size-24 sm:size-32",
    animation: "animate-arcade-float",
    delay: "-2s",
  },
  {
    shape: "plus",
    color: "text-primary/15",
    position: "top-1/2 left-[3%]",
    size: "size-14 sm:size-20",
    animation: "animate-arcade-spin-slow",
    delay: "0s",
  },
  {
    shape: "triangle",
    color: "text-secondary/15",
    position: "top-1/3 right-[4%]",
    size: "size-16 sm:size-24",
    animation: "animate-arcade-float",
    delay: "-4s",
  },
  {
    shape: "diamond",
    color: "text-accent/20",
    position: "bottom-8 left-1/2 -translate-x-1/2",
    size: "size-16 sm:size-20",
    animation: "animate-arcade-drift",
    delay: "-2.5s",
  },
];

function renderSvgShape(shape: ShapeItem["shape"]) {
  switch (shape) {
    case "triangle":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
          <polygon points="50,8 95,90 5,90" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
          <polygon points="50,6 94,50 50,94 6,50" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
          <circle cx="50" cy="50" r="42" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
          <rect x="12" y="12" width="76" height="76" rx="14" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
          <path d="M36 10 H64 V36 H90 V64 H64 V90 H36 V64 H10 V36 H36 Z" />
        </svg>
      );
  }
}

export default function ArcadeLobbyBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {SHAPES.map((item, idx) => (
        <div
          key={idx}
          style={{ animationDelay: item.delay }}
          className={`absolute ${item.position} ${item.size} ${item.color} ${item.animation}`}
        >
          {renderSvgShape(item.shape)}
        </div>
      ))}
    </div>
  );
}
