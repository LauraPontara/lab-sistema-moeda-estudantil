import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
};

export function BrandLogo({
  className = "",
  imageClassName = "h-10 w-auto",
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.jpg"
        alt="XP Estudantil"
        width={160}
        height={48}
        className={`object-contain ${imageClassName}`}
        priority
      />
    </span>
  );
}
