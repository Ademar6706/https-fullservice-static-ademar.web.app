import Image from "next/image";
import placeholderData from "@/lib/placeholder-images.json";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";


export function LiquiMolyLogo(props: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      {...props}
      className={cn("w-20 h-20", props.className)}
    >
      <g>
        <path fill="#005096" d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 186.2c-47.6 0-86.2-38.6-86.2-86.2S52.4 13.8 100 13.8s86.2 38.6 86.2 86.2-38.6 86.2-86.2 86.2z"/>
        <path fill="#ED1C24" d="M100 27.6c-40 0-72.4 32.4-72.4 72.4s32.4 72.4 72.4 72.4 72.4-32.4 72.4-72.4-32.4-72.4-72.4-72.4zm0 132.8c-33.3 0-60.4-27.1-60.4-60.4s27.1-60.4 60.4-60.4 60.4 27.1 60.4 60.4-27.1 60.4-60.4 60.4z"/>
        <path fill="#FFF" d="M100 39.6c-33.3 0-60.4 27.1-60.4 60.4s27.1 60.4 60.4 60.4 60.4-27.1 60.4-60.4-27.1-60.4-60.4-60.4zm0 108.8c-26.7 0-48.4-21.7-48.4-48.4s21.7-48.4 48.4-48.4 48.4 21.7 48.4 48.4-21.7 48.4-48.4 48.4z"/>
        <path fill="#005096" d="M100 51.6c-26.7 0-48.4 21.7-48.4 48.4s21.7 48.4 48.4 48.4 48.4-21.7 48.4-48.4-21.7-48.4-48.4-48.4zm0 84.8c-20 0-36.4-16.3-36.4-36.4s16.3-36.4 36.4-36.4 36.4 16.3 36.4 36.4-16.3 36.4-36.4 36.4z"/>
        <path fill="#ED1C24" d="M123.1 72.4h-46.2c-1.9 0-3.4 1.5-3.4 3.4v48.4c0 1.9 1.5 3.4 3.4 3.4h46.2c1.9 0 3.4-1.5 3.4-3.4V75.8c0-1.9-1.5-3.4-3.4-3.4z"/>
      </g>
    </svg>
  );
}

export function FullServiceLogo(props: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 100"
      {...props}
      className={cn("w-24 h-12", props.className)}
    >
      <rect width="200" height="100" fill="#003A70"/>
      <polygon points="0,100 40,100 60,0 0,0" fill="#D52B1E"/>
      <text x="70" y="45" fontFamily="Arial, sans-serif" fontSize="30" fill="white" fontWeight="bold">FULL</text>
      <text x="70" y="80" fontFamily="Arial, sans-serif" fontSize="30" fill="white" fontWeight="bold">SERVICE</text>
    </svg>
  );
}
