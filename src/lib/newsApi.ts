export interface ExternalNewsResult {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY as string;
const GNEWS_URL = "https://gnews.io/api/v4/search";

export async function findMoreNews(
  query: string,
  category?: string
): Promise<ExternalNewsResult[]> {
  if (!GNEWS_API_KEY) {
    throw new Error("Missing VITE_GNEWS_API_KEY in your .env file.");
  }

  const params = new URLSearchParams({
    q: query,
    lang: "en",
    max: "10",
    apikey: GNEWS_API_KEY,
  });

  if (category) {
    params.set("topic", category);
  }

  const response = await fetch(`${GNEWS_URL}?${params.toString()}`);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GNews API error: ${response.status} ${errText}`);
  }

  const data = await response.json();

  return (data.articles ?? []).map((article: any) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    source: article.source?.name ?? "Unknown",
    publishedAt: article.publishedAt,
  }));
}