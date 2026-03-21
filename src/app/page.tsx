import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4">
      <h1 className="text-4xl font-bold text-gray-900 text-center">Stori</h1>
      <p className="mt-3 text-lg text-gray-500 text-center max-w-md">
        What I wish I knew — real stories from first-gen students
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/explore"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
        >
          Explore Stories
        </Link>
        <Link
          href="/upload"
          className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-center font-medium hover:bg-blue-50 transition-colors"
        >
          Share Your Story
        </Link>
      </div>
    </div>
  );
}
