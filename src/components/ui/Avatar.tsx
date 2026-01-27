"use client";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function Avatar({ src, name, size = "md" }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size].split(" ").slice(0, 2).join(" ")} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-zinc-200 flex items-center justify-center`}
    >
      <span className="font-medium text-zinc-600">{initial}</span>
    </div>
  );
}
