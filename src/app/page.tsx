"use client";

import { useState, useRef } from "react";

interface SavedStory {
  summary: string;
  tags: string[];
}

interface SearchResult {
  id: string;
  content: string;
  summary: string;
  tags: string[];
  media_url: string | null;
}

const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".mpeg"];

function MediaPlayer({ url }: { url: string | null }) {
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

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStory, setSavedStory] = useState<SavedStory | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<{ summary: string; tags: string[] } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchDone, setSearchDone] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        setPreview({ summary: data.summary, tags: data.tags });
      } else {
        setError(data.error || "Failed to generate preview.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPreviewing(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);
    setSearchDone(false);
    setExpandedId(null);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
      setSearchDone(true);
    }
  }

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
        setPreview(null);
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
            accept=".mp3,.mp4,.m4a,.wav,.webm,.ogg,.flac,.aac,.mov,audio/*,video/*"
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
                <h3 className="text-sm font-semibold text-gray-700">Summary</h3>
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

      {/* ---- Semantic Search ---- */}
      <hr className="my-10 border-gray-200" />

      <h2 className="text-xl font-bold mb-4">Search Stories</h2>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. feeling like I didn't belong in college"
          className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={searching}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {searchDone && searchResults.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No stories found.</p>
      )}

      {searchResults.length > 0 && (
        <div className="mt-4 space-y-3">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="p-4 bg-white border border-gray-200 rounded"
            >
              <MediaPlayer url={result.media_url} />
              <p className="text-sm text-gray-800">{result.summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() =>
                  setExpandedId(expandedId === result.id ? null : result.id)
                }
                className="mt-2 text-xs text-blue-600 hover:underline"
              >
                {expandedId === result.id ? "Hide full story" : "Show full story"}
              </button>
              {expandedId === result.id && (
                <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                  {result.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
