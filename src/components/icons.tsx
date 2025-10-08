import Image from "next/image";
import placeholderData from "@/lib/placeholder-images.json";
import type { SVGProps } from "react";

const { placeholderImages } = placeholderData;

const getImage = (id: string) => {
  const image = placeholderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback for when image is not found
    return {
      imageUrl: "https://picsum.photos/seed/default/200/100",
      imageHint: "placeholder",
    };
  }
  return image;
};

export function LiquiMolyLogo(props: SVGProps<SVGSVGElement> & { className?: string }) {
  const { imageUrl, imageHint } = getImage("liqui-moly-logo");
  return (
    <div className={props.className}>
      <Image
        src={imageUrl}
        alt="Liqui Moly Logo"
        width={200}
        height={100}
        className="object-contain w-full h-full"
        data-ai-hint={imageHint}
      />
    </div>
  );
}

export function FullServiceLogo(props: SVGProps<SVGSVGElement> & { className?: string }) {
  const { imageUrl, imageHint } = getImage("full-service-logo");
  return (
    <div className={props.className}>
      <Image
        src={imageUrl}
        alt="Full Service Logo"
        width={200}
        height={100}
        className="object-contain w-full h-full"
        data-ai-hint={imageHint}
      />
    </div>
  );
}
