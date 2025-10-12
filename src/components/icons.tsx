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
      viewBox="0 0 200 200"
      {...props}
      className={cn("w-24 h-24", props.className)}
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dy="2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path
          id="serrated"
          d="M100,10 a90,90 0 1,1 0,180 a90,90 0 1,1 0,-180 M100,18 a82,82 0 1,1 0,164 a82,82 0 1,1 0,-164"
          fillRule="evenodd"
        />
        <clipPath id="serrated-clip">
          <use href="#serrated" />
        </clipPath>
        <g id="star">
          <polygon points="10,0 4,18 19,6 1,6 16,18" fill="white" />
        </g>
      </defs>
      
      <circle cx="100" cy="100" r="100" fill="transparent" />

      {/* <!-- Serrated Badge background --> */}
      <g clipPath="url(#serrated-clip)">
        <circle cx="100" cy="100" r="90" fill="#d40000" />
      </g>
      <use href="#serrated" fill="#d40000" />
      
      <g filter="url(#shadow)">
      {/* <!-- Ribbon --> */}
      <path d="M25,90 h150 v20 H25z" fill="#1a1a1a" />
      <text x="100" y="106" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fill="white" fontWeight="bold" letterSpacing="1">
        FULL SERVICE
      </text>

      {/* <!-- Car silhouette --> */}
      <path d="M125,55 C120,50 80,50 75,55 L65,80 h70 z" fill="#d40000"/>
      <path d="M72,60 H88 V75 H72z M112,60 H128 V75 H112z" fill="white"/>
      <path d="M70,85 h-5 l5,-10 h10 l-10,10z M130,85 h5 l-5,-10 h-10 l10,10z" fill="white" />
      <path d="M65,80 h70 v5 H65z" fill="#1a1a1a"/>
      </g>
      
      {/* <!-- Stars --> */}
      <use href="#star" x="65" y="125" transform="scale(0.8)" />
      <use href="#star" x="92.5" y="120" transform="scale(1)" />
      <use href="#star" x="125" y="125" transform="scale(0.8)" />
    </svg>
  );
}
