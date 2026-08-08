import { User } from "lucide-react";
import { cn } from "@brightpath/utils";

const SIZES = {
  sm: "size-9",
  lg: "size-14",
} as const;

const ICON_SIZES = {
  sm: "size-4",
  lg: "size-6",
} as const;

interface PersonAvatarProps {
  size?: keyof typeof SIZES;
  className?: string;
}

// Same generic placeholder-avatar language StudentsList already established
// (accent-dim circle, accent icon) -- reused here rather than a new style.
export function PersonAvatar({ size = "sm", className }: PersonAvatarProps) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full", SIZES[size], className)}
      style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
    >
      <User aria-hidden="true" className={ICON_SIZES[size]} />
    </div>
  );
}
