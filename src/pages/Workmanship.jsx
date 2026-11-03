import { useEffect } from "react";

/**
 * The full workmanship campaign is a standalone landing page deployed at
 * /workmanship/index.html. A hard navigation ensures visitors coming from
 * the React site's client-side links see that same campaign page.
 */
export default function Workmanship() {
  useEffect(() => {
    window.location.replace("/workmanship/");
  }, []);

  return (
    <main className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-semibold">Opening our workmanship promise…</h1>
      <p className="mt-4">
        <a className="underline" href="/workmanship/">
          View the full SplitsPro workmanship page
        </a>
      </p>
    </main>
  );
}
