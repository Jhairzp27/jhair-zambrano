// components/ui/ProtectedVideo.tsx
import { imagekit } from "@/lib/imagekit";

interface ProtectedVideoProps {
  videoPath: string;
}

export default function ProtectedVideo({ videoPath }: ProtectedVideoProps) {
  const signedUrl = imagekit.url({
    path: videoPath,
    signed: true,
    expireSeconds: 1800,
  });

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800 shadow-lg">
      <video
        controls
        controlsList="nodownload"
        className="w-full h-auto object-cover"
        preload="metadata"
      >
        <source src={signedUrl} type="video/mp4" />
        Tu navegador no soporta el formato de video.
      </video>
    </div>
  );
}
