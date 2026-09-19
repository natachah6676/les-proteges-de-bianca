import { cn } from "@/lib/utils";

type PhotoFrameProps = {
  src: string | null | undefined;
  alt: string;
  emptyLabel?: string;
  className?: string;
  imgClassName?: string;
};

export function PhotoFrame({
  src,
  alt,
  emptyLabel = "Les photos arrivent bientôt.",
  className,
  imgClassName,
}: PhotoFrameProps) {
  if (!src) {
    return (
      <div className={cn("empty-photo min-h-48 w-full", className)}>
        <p className="max-w-[16rem] text-sm leading-relaxed">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-cream-deep", className)}>
      {/* User photos keep their own proportions as much as possible. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full object-cover object-center", imgClassName)}
      />
    </div>
  );
}
