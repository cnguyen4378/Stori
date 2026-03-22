import Link from "next/link";

const topics = [
  "finances",
  "imposter syndrome",
  "internships",
  "family pressure",
  "homesickness",
  "career advice",
  "transferring schools",
  "making friends",
  "graduation regrets",
];

const featuredStories = [
  {
    title: "I thought everyone else understood financial aid except me",
    excerpt:
      "The hardest part was not the paperwork. It was feeling like I was the only person guessing. I wish I had known that asking basic questions early would have saved me so much stress.",
    type: "Written story",
    tag: "finances",
  },
  {
    title: "My first internship taught me that confidence can sound quiet",
    excerpt:
      "I kept waiting to feel ready before speaking up. What helped was realizing that thoughtful questions were part of showing up well, not proof that I did not belong there.",
    type: "Audio story",
    tag: "internships",
  },
  {
    title: "Homesickness hit me long after freshman year",
    excerpt:
      "I expected to feel better with time, so I didn't know what to call it when the loneliness came back later. Hearing someone else describe that experience would have changed everything.",
    type: "Written story",
    tag: "homesickness",
  },
];

const valueCards = [
  {
    title: "Real perspective",
    body: "Stori centers lived experience from first-gen graduates, not generic advice copied from a hundred other places.",
  },
  {
    title: "Easy to explore",
    body: "Students can quickly browse stories, themes, and practical lessons without getting lost in clutter or long explanations.",
  },
  {
    title: "Built for honesty",
    body: "The product makes room for mistakes, uncertainty, and the quiet wins that often matter most in a first-gen journey.",
  },
];

const findCards = [
  {
    title: "Written and audio stories",
    body: "Short, relatable stories shared in the format that feels most natural, whether that is writing or speaking out loud.",
  },
  {
    title: "Clear topics and tags",
    body: "Advice categories like finances, family pressure, and internships help students find what feels relevant right away.",
  },
  {
    title: "Practical and emotional guidance",
    body: "Students get both honest feelings and useful takeaways, which is often what generic college advice leaves out.",
  },
];

const steps = [
  {
    title: "Explore real stories",
    body: "Start with first-gen experiences that feel grounded, specific, and easy to scan.",
  },
  {
    title: "Learn from lived experience",
    body: "See what people wish they had known earlier about school, work, belonging, and growing up fast.",
  },
  {
    title: "Share your own journey",
    body: "Add your story so someone else has a clearer path than you did.",
  },
];

const impactPoints = [
  "Belonging grows when students can recognize themselves in someone else's story.",
  "Confidence grows when advice feels specific, honest, and emotionally true.",
  "Mentorship becomes more accessible when guidance is archived instead of hidden in one-off conversations.",
];

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

      <section id="why" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Stori"
          title="First-gen students deserve advice that sounds like it came from someone who actually understands."
          description="There are plenty of general resources online, but far fewer places where students can hear honest, relatable stories from people who have lived through similar pressure, uncertainty, and decisions. Stori fills that gap with guidance rooted in real experience."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {valueCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.5rem] border border-[#e5d6c5] bg-[#fffaf4] p-6 shadow-[0_12px_28px_rgba(87,62,41,0.08)]"
            >
              <h3 className="text-xl font-semibold text-[#3a2b1f]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#695647]">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="find" className="border-y border-[#e5d6c5] bg-[#fbf6f0]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What you'll find"
            title="A cleaner path into stories, advice, and the moments people wish were easier to talk about."
            description="The full product includes submission, storage, search, summaries, transcription, and vector-based discovery. This landing page simply frames that experience clearly and keeps the value easy to scan."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {findCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-[#e3d3c1] bg-white p-6 shadow-[0_12px_28px_rgba(87,62,41,0.06)]"
              >
                <h3 className="text-xl font-semibold text-[#3a2b1f]">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#695647]">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="topics" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Topics preview"
          title="The kinds of stories students can scan at a glance."
          description="From practical challenges to emotional ones, the archive helps students quickly recognize the themes that match what they are going through."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {topics.map((topic, index) => (
            <span
              key={topic}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium shadow-[0_8px_16px_rgba(87,62,41,0.06)]",
                index % 3 === 0
                  ? "bg-[#42583b] text-[#f8f2e8]"
                  : index % 3 === 1
                    ? "bg-[#f0dfcf] text-[#5b4638]"
                    : "bg-[#f7f0e7] text-[#705c4c] border border-[#e0cfbc]",
              ].join(" ")}
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      <section id="stories" className="border-y border-[#e5d6c5] bg-[#fbf6f0]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured stories"
            title="A preview of the voices students could come here to learn from."
            description="These examples are placeholders, but they are written to feel personal, practical, and emotionally grounded instead of polished for marketing."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featuredStories.map((story) => (
              <article
                key={story.title}
                className="rounded-[1.75rem] border border-[#e2d3c3] bg-white p-6 shadow-[0_16px_34px_rgba(87,62,41,0.08)] transition duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#e8f0e4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#42583b]">
                    {story.type}
                  </span>
                  <span className="text-sm text-[#7a6554]">{story.tag}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-tight text-[#37281e]">
                  {story.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#695647]">{story.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="A simple flow students can understand right away."
          description="The page is intentionally straightforward so the two primary next steps never get buried."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[1.5rem] border border-[#e5d6c5] bg-[#fffaf4] p-6 shadow-[0_12px_28px_rgba(87,62,41,0.06)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5f6f56]">
                Step {index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-[#392a1f]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#695647]">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="impact" className="bg-[linear-gradient(180deg,_#4f3d30_0%,_#655041_100%)] text-[#f8f2e8]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <SectionHeading
              eyebrow="Community impact"
              title="When advice feels relatable, students can move with more confidence."
              description="Stori is about belonging, mentorship, honesty, and shared experience. It helps students feel like they are not navigating major decisions in total isolation."
              inverted
            />
            <div className="grid gap-4">
              {impactPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[1.5rem] border border-[#806b5d] bg-[rgba(255,248,240,0.08)] p-5 text-[#f8f2e8] shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
                >
                  <p className="text-sm leading-7 text-[#f6eee3]">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
            <a href="#why">Why Stori</a>
            <a href="#find">What you'll find</a>
            <a href="#topics">Topics</a>
            <a href="#stories">Stories</a>
            <a href="#how">How it works</a>
            <a href="#impact">Impact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
