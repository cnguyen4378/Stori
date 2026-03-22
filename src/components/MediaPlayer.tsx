"use client";

import { useState } from "react";

const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".mpeg"];
const AUDIO_EXTS = [".mp3", ".m4a", ".wav", ".ogg", ".flac", ".aac", ".webm"];

export default function MediaPlayer({ url }: { url: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!url || failed) return null;

  const lower = url.toLowerCase();
  const isVideo = VIDEO_EXTS.some((ext) => lower.endsWith(ext));
  const isAudio = AUDIO_EXTS.some((ext) => lower.endsWith(ext));

  if (isVideo) {
    return (
      <video
        controls
        preload="metadata"
        className="w-full rounded-[1rem]"
        onError={() => setFailed(true)}
      >
        <source src={url} />
        Your browser does not support this video format.
      </video>
    );
  }

  if (isAudio) {
    return (
      <div className="bg-[#efe3d4] rounded-[1rem] p-4">
        <audio
          controls
          preload="metadata"
          className="w-full"
          onError={() => setFailed(true)}
        >
          <source src={url} />
        </audio>
      </div>
    );
  }

  return (
    <div className="bg-[#efe3d4] rounded-[1rem] p-4">
      <audio
        controls
        preload="metadata"
        className="w-full"
        onError={() => setFailed(true)}
      >
        <source src={url} />
      </audio>
    </div>
  );
}
