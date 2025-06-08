import React from "react";

import Image from "next/image";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Image as ImageType } from "@/types/types";


export const FullImage = ({ image, className }: { image?: ImageType, className?: string }) => {
  if (!image) return null;
  return (
    <div className="flex justify-center items-center w-full z-10">
      <Image
        src={strapiImage(image.url)}
        alt={image.alternativeText || "Image"}
        width={270}
        height={270}
        className={className ? `${className} max-w-[270px]` : "w-full h-auto max-w-[270px]"}
      />
    </div>
  );
};