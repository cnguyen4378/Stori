"use client";

import { useState, useRef } from "react";

interface SavedStory {
  summary: string;
  tags: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStory, setSavedStory] = useState<SavedStory | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleTranscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setTranscription("");
    setError("");
    setSavedStory(null);

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

  async function handleSaveStory() {
    if (!transcription) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: transcription }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSavedStory({
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Stori</h1>

      <form onSubmit={handleTranscribe} className="space-y-4">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".mp3,.mp4,.m4a,.wav,.webm,.ogg,.flac,.aac,audio/*,video/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setSavedStory(null);
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

      {transcription && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Transcription</h2>
          <div className="p-4 bg-white border border-gray-200 rounded whitespace-pre-wrap">
            {transcription}
          </div>

          {!savedStory && (
            <button
              onClick={handleSaveStory}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Processing & Saving..." : "Save Story"}
            </button>
          )}
        </div>
      )}

      {savedStory && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded space-y-3">
          <p className="font-medium text-green-800">Story saved!</p>

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
        </div>
      )}
    </div>
  );
}
