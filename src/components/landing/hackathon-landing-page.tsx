import Link from "next/link";
import { getAllStories } from "@/lib/db";


function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={[
          "text-sm font-semibold uppercase tracking-[0.26em]",
          inverted ? "text-[#b8c7ae]" : "text-[#5f6f56]",
        ].join(" ")}
      >
        {eyebrow}
      </p>
      <h2
        className={[
          "mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
          inverted ? "text-[#f8f2e8]" : "text-[#3f2f22]",
        ].join(" ")}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={[
            "mt-4 text-base leading-8 sm:text-lg",
            inverted ? "text-[#eadfce]" : "text-[#6b5748]",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

function FeaturedStoriesSection() {
  const stories = getAllStories().slice(0, 3);

  if (stories.length === 0) {
    return (
      <section id="stories" className="border-y border-[#e5d6c5] bg-[#fbf6f0]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Stories"
            title="Be the first to share your story."
            description="No stories have been shared yet. Your experience could help someone feel less alone."
          />
          <div className="mt-8">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-full bg-[#42583b] px-7 py-3.5 text-base font-semibold text-[#f8f2e8] shadow-[0_14px_30px_rgba(66,88,59,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#364a30]"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="stories" className="border-y border-[#e5d6c5] bg-[#fbf6f0]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Real stories"
          title="Voices from students who have been where you are."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {stories.map((story) => {
            const tags: string[] = (() => {
              try { return JSON.parse(story.tags); } catch { return []; }
            })();
            const videoExts = [".mp4", ".webm", ".mov", ".mpeg"];
            const mediaType = story.media_url
              ? videoExts.some((ext) => story.media_url!.toLowerCase().endsWith(ext))
                ? "Video story"
                : "Audio story"
              : "Written story";
            const summaryPreview = story.summary?.length > 180
              ? story.summary.slice(0, 180) + "..."
              : story.summary;

            return (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="block rounded-[1.75rem] border border-[#e2d3c3] bg-white p-6 shadow-[0_16px_34px_rgba(87,62,41,0.08)] transition duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#e8f0e4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#42583b]">
                    {mediaType}
                  </span>
                  {tags[0] && (
                    <span className="text-sm text-[#7a6554]">{tags[0]}</span>
                  )}
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-tight text-[#37281e]">
                  {story.title || "Untitled Story"}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#695647]">
                  {summaryPreview || "No summary available."}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HackathonLandingPage() {
  return (
    <div className="bg-[#f7f0e7] text-[#3f2f22]">
      <section className="border-b border-[#e7d9c7] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.85),_transparent_32%),linear-gradient(180deg,_#fbf6f0_0%,_#f5ecdf_100%)]">
        <div className="mx-auto max-w-5xl px-8 py-16 text-center sm:px-20 lg:px-28 lg:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#5f6f56]">
            What I wish I knew, from people who lived it
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#32251c] sm:text-5xl lg:text-6xl lg:leading-[1.05] mx-4">
            A story archive that helps first-generation students feel more prepared and less alone.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#6b5748]">
            Stori is a warm, searchable archive of short written and audio
            stories from first-gen graduates sharing mistakes, wins, and the
            advice they wish they heard earlier. It gives students guidance
            that feels lived-in, honest, and actually useful.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-full bg-[#42583b] px-7 py-3.5 text-base font-semibold text-[#f8f2e8] shadow-[0_14px_30px_rgba(66,88,59,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#364a30]"
            >
              Explore Stories
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-full border border-[#cdb79f] bg-[#fffaf3] px-7 py-3.5 text-base font-semibold text-[#4e3b2d] shadow-[0_10px_24px_rgba(78,59,45,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#b79f84] hover:bg-[#f8efe3]"
            >
              Share Your Story
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-[#765f4e]">
            <span className="rounded-full bg-[#efe3d4] px-4 py-2">written stories</span>
            <span className="rounded-full bg-[#efe3d4] px-4 py-2">audio stories</span>
            <span className="rounded-full bg-[#efe3d4] px-4 py-2">clear topic tags</span>
            <span className="rounded-full bg-[#efe3d4] px-4 py-2">AI summaries and search context</span>
          </div>
        </div>
      </section>

      <FeaturedStoriesSection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#dccbb8] bg-[linear-gradient(180deg,_#fffaf4_0%,_#f3e7d8_100%)] px-6 py-10 text-center shadow-[0_18px_40px_rgba(87,62,41,0.1)] sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#5f6f56]">
            Ready to explore or contribute?
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#34261c] sm:text-4xl lg:text-5xl">
            Start with a story you need, or leave behind one you wish you had.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#695647] sm:text-lg">
            The most important next steps are simple: browse honest first-gen
            stories or share one of your own so someone else has a stronger
            roadmap than you did.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/explore"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#42583b] px-7 py-3.5 text-base font-semibold text-[#f8f2e8] shadow-[0_14px_30px_rgba(66,88,59,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#364a30]"
            >
              Explore Stories
            </Link>
            <Link
              href="/upload"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#cdb79f] bg-white px-7 py-3.5 text-base font-semibold text-[#4e3b2d] shadow-[0_10px_24px_rgba(78,59,45,0.08)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f8efe3]"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e5d6c5] bg-[#fbf6f0]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-[#6e5a4b] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-lg font-semibold text-[#3f2f22]">Stori</p>
            <p className="mt-1 leading-6">
              Honest stories and practical guidance for first-generation students.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#stories">Stories</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
