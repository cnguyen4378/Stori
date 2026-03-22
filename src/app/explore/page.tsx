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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-[#3f2f22] mb-1">
        Explore Stories
      </h1>
      <p className="text-base text-[#6b5748] mb-8">
        Search for experiences, advice, and moments that resonate with you.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for experiences (e.g. internships, imposter syndrome)"
          className="flex-1 bg-[#fffaf4] border border-[#e5d6c5] rounded-full px-5 py-3 text-sm text-[#3f2f22] placeholder:text-[#7a6554]/50 focus:outline-none focus:ring-2 focus:ring-[#42583b]/20 focus:border-[#42583b]/30 transition duration-200 shadow-sm"
        />
        <button
          type="submit"
          disabled={searching}
          className="px-7 py-3 bg-[#42583b] text-[#f8f2e8] rounded-full hover:bg-[#364a30] disabled:opacity-50 text-sm font-semibold transition duration-200 shadow-sm"
        >
          {searching ? "Searching..." : "Search"}
        </button>
        {searchDone && (
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-3 border border-[#cdb79f] text-[#4e3b2d] rounded-full hover:bg-[#f8efe3] text-sm transition duration-200"
          >
            Clear
          </button>
        )}
      </form>

      <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56] mt-10 mb-4">
        {heading}
      </h2>

      {stories.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-base text-[#6b5748]">
            {searchDone
              ? "No stories matched your search. Try different words."
              : "No stories yet. Be the first to share yours."}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/story/${story.id}`}
            className="block p-6 bg-[#fffaf4] border border-[#e5d6c5] rounded-[1.5rem] shadow-[0_12px_28px_rgba(87,62,41,0.06)] hover:shadow-[0_16px_34px_rgba(87,62,41,0.1)] hover:-translate-y-0.5 transition duration-200 cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-[#3f2f22] leading-snug">
              {story.title || "Untitled Story"}
            </h3>
            <p className="text-sm text-[#6b5748] leading-7 mt-2 line-clamp-2">
              {story.summary.length > 180
                ? story.summary.slice(0, 177) + "..."
                : story.summary}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#efe3d4] text-[#765f4e]"
                >
                  {tag}
                </span>
              ))}
              {story.media_url && (
                <span className="text-xs text-[#7a6554]/50 ml-auto">
                  Has audio/video
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
