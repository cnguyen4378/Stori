"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface SavedStory {
  title: string;
  summary: string;
  tags: string[];
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStory, setSavedStory] = useState<SavedStory | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<{
    title: string;
    summary: string;
    tags: string[];
  } | null>(null);

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
    setError("");
    setSavedStory(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Share Your Story</h1>

      <form onSubmit={handleTranscribe} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Transcribing..." : "Transcribe"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded">
          {error}
        </div>
      )}

      {transcription && !savedStory && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Transcription</h2>
          <textarea
            value={transcription}
            onChange={(e) => {
              setTranscription(e.target.value);
              setPreview(null);
            }}
            rows={8}
            className="w-full p-4 bg-white border border-gray-200 rounded text-sm leading-relaxed resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">
            You can edit the transcription above before previewing.
          </p>

          {!preview && (
            <button
              onClick={handlePreview}
              disabled={previewing || !transcription.trim()}
              className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {previewing ? "Generating Preview..." : "Preview Summary & Tags"}
            </button>
          )}

          {preview && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Title</h3>
                <p className="text-gray-900 font-medium">{preview.title}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Summary
                </h3>
                <p className="text-gray-800 text-sm">{preview.summary}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {preview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveStory}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  {saving ? "Saving..." : "Confirm & Save"}
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {savedStory && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded space-y-3">
          <p className="font-medium text-green-800">Story saved!</p>

          <div>
            <h3 className="text-sm font-semibold text-gray-700">Title</h3>
            <p className="text-gray-900 font-medium">{savedStory.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700">Summary</h3>
            <p className="text-gray-800">{savedStory.summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {savedStory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Upload Another
            </button>
            <Link
              href="/explore"
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 text-sm"
            >
              Explore Stories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
