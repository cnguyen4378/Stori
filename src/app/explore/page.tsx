"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Story {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  media_url: string | null;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Story[]>([]);
  const [recent, setRecent] = useState<Story[]>([]);
  const [searchDone, setSearchDone] = useState(false);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => setRecent(data))
      .catch(() => {});
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setResults([]);
    setSearchDone(false);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setResults(data);
    } catch {
      /* silent fail */
    } finally {
      setSearching(false);
      setSearchDone(true);
    }
  }

  function handleClear() {
    setSearchQuery("");
    setResults([]);
    setSearchDone(false);
  }

  const stories = searchDone ? results : recent;
  const heading = searchDone
    ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
    : "Recent Stories";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Explore Stories</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. feeling like I didn't belong in college"
          className="flex-1 border border-gray-200 rounded px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={searching}
          className="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {searching ? "Searching..." : "Search"}
        </button>
        {searchDone && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2.5 border border-gray-200 text-gray-500 rounded hover:bg-gray-50 text-sm"
          >
            Clear
          </button>
        )}
      </form>

      <h2 className="text-sm font-medium text-gray-500 mt-8 mb-3">
        {heading}
      </h2>

      {stories.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">
          {searchDone ? "No stories matched your search." : "No stories yet."}
        </p>
      )}

      <div className="space-y-3">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/story/${story.id}`}
            className="block p-4 bg-white border border-gray-200 rounded hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900">
              {story.title || "Untitled Story"}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {story.summary.length > 180
                ? story.summary.slice(0, 177) + "..."
                : story.summary}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            {story.media_url && (
              <p className="mt-2 text-xs text-gray-400">
                Has audio/video
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
