import { Style, Avatar } from "@dicebear/core";
import definition from "@dicebear/styles/critters.json" with { type: "json" };

const crittersStyle = new Style(definition);

type ArcadeCritterAvatarProps = {
  name: string;
  gameCode: string;
  sizeClassName?: string;
  className?: string;
};

export default function ArcadeCritterAvatar({
  name,
  gameCode,
  sizeClassName = "size-12",
  className = "",
}: ArcadeCritterAvatarProps) {
  const seed = `${name}_${gameCode}`;
  const avatar = new Avatar(crittersStyle, {
    seed,
    animation: true,
    idRandomization: true,
  });

  const svg = avatar.toString();

  return (
    <div
      className={` shrink-0 overflow-hidden rounded-box border-2 border-base-300 bg-base-200 ${sizeClassName} ${className}`.trim()}
      aria-label={`${name} avatar`}
      role="img"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
