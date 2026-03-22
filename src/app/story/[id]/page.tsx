import { getStoryById } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import MediaPlayer from "@/components/MediaPlayer";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = getStoryById(id);

  if (!story) notFound();

  const tags: string[] = JSON.parse(story.tags);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/explore"
        className="text-sm text-[#5f6f56] hover:text-[#42583b] font-medium transition duration-200"
      >
        &larr; Back to Explore
      </Link>

      <article className="mt-8 bg-[#fffaf4] border border-[#e5d6c5] rounded-[1.75rem] shadow-[0_16px_34px_rgba(87,62,41,0.08)] p-6 sm:p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-[#3f2f22] tracking-tight leading-snug">
          {story.title || "Untitled Story"}
        </h1>

        <div className="rounded-[1rem] overflow-hidden">
          <MediaPlayer url={story.media_url} />
        </div>

        <details className="group">
          <summary className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56] cursor-pointer select-none list-none flex items-center gap-2">
            Summary
            <span className="text-xs transition-transform duration-200 group-open:rotate-90">&#9654;</span>
          </summary>
          <p className="text-base text-[#6b5748] leading-7 mt-3">
            {story.summary}
          </p>
        </details>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#efe3d4] text-[#765f4e]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56] mb-3">
            Full Story
          </p>
          <div className="text-base text-[#3f2f22] leading-[1.85] whitespace-pre-wrap max-w-prose">
            {story.content}
          </div>
        </div>

        <p className="text-xs text-[#7a6554]/50 pt-4 border-t border-[#e5d6c5]">
          Shared on{" "}
          {new Date(story.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </article>
    </div>
  );
}
