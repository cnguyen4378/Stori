"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";

interface SavedStory {
  title: string;
  summary: string;
  tags: string[];
}

export default function UploadPage() {
  const [mode, setMode] = useState<"media" | "text">("media");
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [textDraft, setTextDraft] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStory, setSavedStory] = useState<SavedStory | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filePreviewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<{
    title: string;
    summary: string;
    tags: string[];
  } | null>(null);

  function switchMode(newMode: "media" | "text") {
    setMode(newMode);
    setError("");
    setPreview(null);
    setSavedStory(null);
    if (newMode === "text") {
      setFile(null);
      setTranscription("");
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setTextDraft("");
      setTranscription("");
    }
  }

  async function handleTranscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setTranscription("");
    setError("");
    setSavedStory(null);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setTranscription(data.text);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleTextSubmit() {
    if (!textDraft.trim()) return;
    setTranscription(textDraft.trim());
  }

  async function handlePreview() {
    if (!transcription.trim()) return;

    setPreviewing(true);
    setError("");

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: transcription }),
      });

      const data = await res.json();

      if (res.ok) {
        setPreview({ title: data.title, summary: data.summary, tags: data.tags });
      } else {
        setError(data.error || "Failed to generate preview.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPreviewing(false);
    }
  }

  async function handleSaveStory() {
    if (!transcription) return;

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("content", transcription);
      if (file) formData.append("file", file);

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSavedStory({
          title: data.story.title || "Untitled Story",
          summary: data.story.summary,
          tags: data.story.tags,
        });
      } else {
        setError(data.error || "Failed to save story.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setFile(null);
    setTranscription("");
    setTextDraft("");
    setError("");
    setSavedStory(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#fffaf4] border border-[#e5d6c5] rounded-[1.5rem] shadow-[0_12px_28px_rgba(87,62,41,0.08)] p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#3f2f22] mb-2">
              Share Your Story
            </h1>
            <p className="text-sm text-[#6b5748] leading-7">
              Your experience could help someone feel less alone.
            </p>
          </div>

          <div className="flex gap-2 p-1 bg-[#efe3d4] rounded-full">
            <button
              type="button"
              onClick={() => switchMode("media")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition duration-200 ${
                mode === "media"
                  ? "bg-[#fffaf4] text-[#3f2f22] shadow-sm"
                  : "text-[#6b5748] hover:text-[#3f2f22]"
              }`}
            >
              Upload Media
            </button>
            <button
              type="button"
              onClick={() => switchMode("text")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition duration-200 ${
                mode === "text"
                  ? "bg-[#fffaf4] text-[#3f2f22] shadow-sm"
                  : "text-[#6b5748] hover:text-[#3f2f22]"
              }`}
            >
              Write It Out
            </button>
          </div>

          {mode === "media" ? (
            <form onSubmit={handleTranscribe} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#3f2f22] mb-2">
                  Upload audio or video
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".mp3,.mp4,.m4a,.wav,.webm,.ogg,.flac,.aac,.mov,audio/*,video/*"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setSavedStory(null);
                    setPreview(null);
                    setTranscription("");
                  }}
                  className="block w-full text-sm text-[#6b5748] file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:bg-[#efe3d4] file:text-[#4e3b2d] file:font-medium file:cursor-pointer hover:file:bg-[#e5d6c5] transition duration-200"
                />
              </div>

              {file && filePreviewUrl && (
                <div className="rounded-[1rem] overflow-hidden">
                  {file.type.startsWith("video/") ? (
                    <video
                      controls
                      preload="metadata"
                      className="w-full rounded-[1rem]"
                      src={filePreviewUrl}
                    />
                  ) : (
                    <div className="bg-[#efe3d4] rounded-[1rem] p-4">
                      <audio
                        controls
                        preload="metadata"
                        className="w-full"
                        src={filePreviewUrl}
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || loading}
                className="px-7 py-3 bg-[#42583b] text-[#f8f2e8] rounded-full font-semibold hover:bg-[#364a30] disabled:opacity-40 transition duration-200 shadow-sm"
              >
                {loading ? "Transcribing..." : "Transcribe"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#3f2f22] mb-2">
                  Write your story
                </label>
                <textarea
                  value={textDraft}
                  onChange={(e) => {
                    setTextDraft(e.target.value);
                    setSavedStory(null);
                    setPreview(null);
                    setTranscription("");
                  }}
                  rows={8}
                  placeholder="Share what you wish you had known — a challenge, a lesson, a moment that shaped you..."
                  className="w-full p-5 bg-[#fbf6f0] border border-[#e5d6c5] rounded-[1rem] text-sm text-[#3f2f22] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#42583b]/20 transition duration-200 placeholder:text-[#b5a596]"
                />
              </div>

              <button
                type="button"
                onClick={handleTextSubmit}
                disabled={!textDraft.trim()}
                className="px-7 py-3 bg-[#42583b] text-[#f8f2e8] rounded-full font-semibold hover:bg-[#364a30] disabled:opacity-40 transition duration-200 shadow-sm"
              >
                Continue
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-[#f0dfcf] border border-[#e0cfbc] text-[#5b4638] rounded-[1rem] text-sm">
              {error}
            </div>
          )}

          {transcription && !savedStory && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#3f2f22]">
                {mode === "text" ? "Your Story" : "Transcription"}
              </h2>
              <textarea
                value={transcription}
                onChange={(e) => {
                  setTranscription(e.target.value);
                  setPreview(null);
                }}
                rows={8}
                className="w-full p-5 bg-[#fbf6f0] border border-[#e5d6c5] rounded-[1rem] text-sm text-[#3f2f22] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#42583b]/20 transition duration-200"
              />
              <p className="text-xs text-[#7a6554]/60">
                You can edit the text above before previewing.
              </p>

              {!preview && (
                <button
                  onClick={handlePreview}
                  disabled={previewing || !transcription.trim()}
                  className="px-7 py-3 bg-[#42583b] text-[#f8f2e8] rounded-full font-semibold hover:bg-[#364a30] disabled:opacity-40 transition duration-200 shadow-sm"
                >
                  {previewing ? "Generating Preview..." : "Preview Summary & Tags"}
                </button>
              )}

              {preview && (
                <div className="p-6 bg-[#fbf6f0] border border-[#e5d6c5] rounded-[1.5rem] space-y-4">
                  <p className="text-lg font-semibold text-[#3f2f22]">{preview.title}</p>

                  <details className="group" open>
                    <summary className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56] cursor-pointer select-none list-none flex items-center gap-2">
                      Summary
                      <span className="text-xs transition-transform duration-200 group-open:rotate-90">&#9654;</span>
                    </summary>
                    <p className="text-sm text-[#6b5748] leading-7 mt-2">
                      {preview.summary}
                    </p>
                  </details>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56] mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {preview.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[#efe3d4] text-[#765f4e]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveStory}
                      disabled={saving}
                      className="px-7 py-3 bg-[#42583b] text-[#f8f2e8] rounded-full font-semibold hover:bg-[#364a30] disabled:opacity-40 transition duration-200 shadow-sm"
                    >
                      {saving ? "Saving..." : "Confirm & Save"}
                    </button>
                    <button
                      onClick={() => setPreview(null)}
                      className="px-5 py-3 border border-[#cdb79f] text-[#4e3b2d] rounded-full hover:bg-[#f8efe3] transition duration-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {savedStory && (
            <div className="p-6 bg-[#e8f0e4] border border-[#c5d4be] rounded-[1.5rem] space-y-4">
              <p className="text-lg font-semibold text-[#3f2f22]">
                Your story has been saved
              </p>

              <p className="font-semibold text-[#3f2f22]">{savedStory.title}</p>

              <details className="group" open>
                <summary className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56] cursor-pointer select-none list-none flex items-center gap-2">
                  Summary
                  <span className="text-xs transition-transform duration-200 group-open:rotate-90">&#9654;</span>
                </summary>
                <p className="text-sm text-[#6b5748] leading-7 mt-2">
                  {savedStory.summary}
                </p>
              </details>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56] mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {savedStory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#efe3d4] text-[#765f4e]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-7 py-3 bg-[#42583b] text-[#f8f2e8] rounded-full font-semibold hover:bg-[#364a30] transition duration-200 shadow-sm text-sm"
                >
                  Upload Another
                </button>
                <Link
                  href="/explore"
                  className="px-5 py-3 border border-[#cdb79f] text-[#4e3b2d] rounded-full hover:bg-[#f8efe3] transition duration-200 text-sm font-medium"
                >
                  Explore Stories
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
