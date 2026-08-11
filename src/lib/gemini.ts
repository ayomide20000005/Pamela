import { StoryCategory, StoryQuality } from "../types/story";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in your .env file.");
  }

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text.trim();
}

export async function categorizeStory(content: string): Promise<StoryCategory> {
  const prompt = `Read this news story and respond with ONLY one word from this exact list: politics, business, sports, entertainment, health, technology, world, local, uncategorized.\n\nStory:\n${content}`;
  const result = await callGemini(prompt);
  const cleaned = result.toLowerCase().trim();
  const validCategories: StoryCategory[] = [
    "politics", "business", "sports", "entertainment",
    "health", "technology", "world", "local", "uncategorized",
  ];
  return validCategories.includes(cleaned as StoryCategory)
    ? (cleaned as StoryCategory)
    : "uncategorized";
}

export async function scoreQuality(content: string): Promise<{ quality: StoryQuality; notes: string }> {
  const prompt = `Assess this news story's quality for a broadcast bulletin. Respond in EXACTLY this format, nothing else:\nQUALITY: [strong/average/weak]\nNOTES: [one short sentence explaining why]\n\nStory:\n${content}`;
  const result = await callGemini(prompt);

  const qualityMatch = result.match(/QUALITY:\s*(strong|average|weak)/i);
  const notesMatch = result.match(/NOTES:\s*(.+)/i);

  return {
    quality: (qualityMatch?.[1]?.toLowerCase() as StoryQuality) ?? "unrated",
    notes: notesMatch?.[1]?.trim() ?? "",
  };
}

export async function checkDuplicate(storyA: string, storyB: string): Promise<boolean> {
  const prompt = `Are these two news stories reporting the SAME underlying event/news, even if worded differently or from different sources? Respond with ONLY "yes" or "no".\n\nStory A:\n${storyA}\n\nStory B:\n${storyB}`;
  const result = await callGemini(prompt);
  return result.toLowerCase().includes("yes");
}

export async function summarizeStory(content: string): Promise<string> {
  const prompt = `Summarize this news story in one short, clear sentence suitable for a news bulletin:\n\n${content}`;
  return callGemini(prompt);
}

export async function suggestBulletinOrder(storySummaries: string[]): Promise<number[]> {
  const numbered = storySummaries.map((s, i) => `${i}: ${s}`).join("\n");
  const prompt = `Here are news story summaries with index numbers. Suggest the best broadcast order (most important/urgent first). Respond with ONLY the index numbers separated by commas, e.g. "2,0,1,3".\n\n${numbered}`;
  const result = await callGemini(prompt);
  return result
    .split(",")
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n));
}