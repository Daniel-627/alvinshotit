import Image from "next/image";
import type { Img } from "@/lib/types";

export default function Pic({ img, sizes = "(min-width:1024px) 33vw, 50vw", priority = false, className = "" }: { img: Img; sizes?: string; priority?: boolean; className?: string }) {
  return (
    <Image
      src={img.url}
      alt={img.alt || ""}
      width={img.width}
      height={img.height}
      sizes={sizes}
      priority={priority}
      placeholder={img.lqip ? "blur" : "empty"}
      blurDataURL={img.lqip}
      className={`h-auto w-full ${className}`}
    />
  );
}
