"use client";

const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".mpeg"];

export default function MediaPlayer({ url }: { url: string | null }) {
  if (!url) return null;

  const isVideo = VIDEO_EXTS.some((ext) => url.toLowerCase().endsWith(ext));

  if (isVideo) {
    return (
      <video
        controls
        preload="metadata"
        className="w-full rounded-[1rem]"
        onError={(e) => (e.currentTarget.style.display = "none")}
      >
        <source src={url} />
      </video>
    );
  }

  return (
    <div className="bg-[#efe3d4] rounded-[1rem] p-4">
      <audio
        controls
        preload="metadata"
        className="w-full"
        onError={(e) => (e.currentTarget.style.display = "none")}
      >
        <source src={url} />
      </audio>
    </div>
  );
}
