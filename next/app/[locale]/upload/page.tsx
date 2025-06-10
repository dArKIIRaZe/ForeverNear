import { AmbientColor } from "@/components/decorations/ambient-color";
import { UploadVideoForm } from "@/components/upload-video-form";

export default function UploadPage() {
  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <UploadVideoForm />
    </div>
  );
}
