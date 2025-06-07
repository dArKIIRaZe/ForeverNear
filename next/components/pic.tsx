import React from "react";

import Image from "next/image";
import { strapiImage } from "@/lib/strapi/strapiImage";


export const FullImage = ({ image }: { image?: Image }) => {
  if (!image) return null;
  return (
    <div className="flex justify-center items-center w-full z-10">
      <Image
        src={strapiImage(image.url)}
        alt={image.alternativeText || "Image"}
        width={1024}
        height={1024}
        className="w-full h-auto"
      />
    </div>
  );
};