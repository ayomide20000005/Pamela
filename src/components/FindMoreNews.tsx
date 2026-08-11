import { useState } from "react";
import { findMoreNews } from "../lib/newsApi";
import type { ExternalNewsResult } from "../lib/newsApi";
import type { NewStoryInput } from "../types/story";

interface FindMoreNewsProps {
  onImport: (input: NewStoryInput) => void;
}

export default function FindMoreNews({ onImport }: FindMoreNewsProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExternalNewsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedUrls, setImportedUrls] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const news = await findMoreNews(query.trim());
      setResults(news);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (article: ExternalNewsResult) => {
    const content = `${article.title}\n\n${article.description}\n\nSource: ${article.source} (${article.url})`;
    onImport({ content, source: "find-more-news" });
    setImportedUrls((prev) => [...prev, article.url]);
  };

  return (
    <div className="rounded-xl border p-4 bg-[var(--color-surface)] border-[var(--color-border)] shadow-sm">
      <h2 className="text-sm font-semibold mb-3">Find More News</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a topic..."
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm text-white bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      {results.map((article) => (
        <div
          key={article.url}
          className="p-3 mb-2 rounded-lg border border-[var(--color-border)]"
        >
          <p className="text-sm font-medium">{article.title}</p>
          <p className="text-xs opacity-70 mt-1">{article.description}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs opacity-50">{article.source}</span>
            <button
              onClick={() => handleImport(article)}
              disabled={importedUrls.includes(article.url)}
              className="text-xs px-3 py-1 rounded-full bg-[var(--color-accent)] text-white disabled:opacity-40"
            >
              {importedUrls.includes(article.url) ? "Imported" : "Import"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}