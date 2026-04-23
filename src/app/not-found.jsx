import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <div className="container">
        <div className="flex flex-col justify-center items-center gap-3 min-h-[60vh]">
          <h1 className="text-7xl tracking-tight font-extrabold lg:text-9xl text-red-500">
            404
          </h1>
          <p className="text-3xl tracking-tight font-bold text-red-500 md:text-4xl">
            Something&apos;s missing.
          </p>
          <p className="text-lg font-light text-gray-500 text-center">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
          </p>
          <Link
            href="/"
            className="bg-primary text-white px-6 py-2 rounded-sm hover:bg-dark-primary duration-300"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
