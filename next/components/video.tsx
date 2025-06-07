import React from "react";
import { strapiImage } from "@/lib/strapi/strapiImage";

// Accepts a Strapi video object with at least a url and alternativeText
export const FullVideo = ({ video }: { video?: { url: string; alternativeText?: string } }) => {
  if (!video || !video.url) return null;
  return (
    <div className="flex justify-center items-center w-full z-10">
      <video
        src={strapiImage(video.url)}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto"
        style={{ objectFit: "cover" }}
        title={video.alternativeText || "Background video"}
      >
        {video.alternativeText && <track kind="descriptions" label="Video description" />}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};