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
        className="w-full rounded mb-3"
        onError={(e) => (e.currentTarget.style.display = "none")}
      >
        <source src={url} />
      </video>
    );
  }

  return (
    <audio
      controls
      preload="metadata"
      className="w-full mb-3"
      onError={(e) => (e.currentTarget.style.display = "none")}
    >
      <source src={url} />
    </audio>
  );
}
