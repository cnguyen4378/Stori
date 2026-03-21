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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/explore"
        className="text-sm text-blue-600 hover:underline"
      >
        &larr; Back to Explore
      </Link>

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {story.title || "Untitled Story"}
        </h1>

        <MediaPlayer url={story.media_url} />

        <div>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Summary
          </h2>
          <p className="text-gray-800">{story.summary}</p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Full Story
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {story.content}
          </div>
        </div>

        <p className="text-xs text-gray-400">
          {new Date(story.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
