import React from "react";

import Image from "next/image";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Image as ImageType } from "@/types/types";


export const FullImage = ({ image }: { image?: ImageType }) => {
  if (!image) return null;
  return (
    <div className="flex justify-center items-center w-full z-10">
      <Image
        src={strapiImage(image.url)}
        alt={image.alternativeText || "Image"}
        width={180}
        height={180}
        className="w-full h-auto"
      />
    </div>
  );
};