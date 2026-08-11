export type StoryCategory =
  | "politics"
  | "business"
  | "sports"
  | "entertainment"
  | "health"
  | "technology"
  | "world"
  | "local"
  | "uncategorized";

export type StoryQuality = "strong" | "average" | "weak" | "unrated";

export type StorySource = "whatsapp" | "email" | "telegram" | "other" | "find-more-news";

export interface Story {
  id: string;
  content: string;
  source: StorySource;
  category: StoryCategory;
  quality: StoryQuality;
  quality_notes: string | null;
  is_duplicate: boolean;
  duplicate_of: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewStoryInput {
  content: string;
  source: StorySource;
}