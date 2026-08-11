import type { Story, StoryCategory, StoryQuality } from "../types/story";
import QualityIndicator from "./QualityIndicator";
import DuplicateBadge from "./DuplicateBadge";

const CATEGORIES: StoryCategory[] = [
  "politics", "business", "sports", "entertainment",
  "health", "technology", "world", "local", "uncategorized",
];

interface StoryCardProps {
  story: Story;
  allStories: Story[];
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: StoryCategory) => void;
  onQualityChange: (id: string, quality: StoryQuality) => void;
  onMarkDuplicate: (id: string, duplicateOfId: string | null) => void;
}

export default function StoryCard({
  story,
  allStories,
  onDelete,
  onCategoryChange,
  onQualityChange,
  onMarkDuplicate,
}: StoryCardProps) {
  return (
    <div className="rounded-xl border p-4 mb-3 bg-[var(--color-surface)] border-[var(--color-border)] shadow-sm">
      <div className="flex justify-between items-start gap-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{story.content}</p>
        <button
          onClick={() => onDelete(story.id)}
          className="text-xs px-2 py-1 rounded-md shrink-0 bg-[var(--color-accent)] text-white hover:opacity-80"
        >
          Remove
        </button>
      </div>

      <div className="flex gap-2 mt-3 text-xs items-center">
        <select
          value={story.category}
          onChange={(e) => onCategoryChange(story.id, e.target.value as StoryCategory)}
          className="text-xs rounded-full border border-[var(--color-border)] bg-transparent px-2 py-1 capitalize"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="px-2 py-1 rounded-full border border-[var(--color-border)] capitalize">
          {story.source}
        </span>
      </div>

      <QualityIndicator
        quality={story.quality}
        notes={story.quality_notes}
        onChange={(quality) => onQualityChange(story.id, quality)}
      />

      <DuplicateBadge
        story={story}
        allStories={allStories}
        onMarkDuplicate={onMarkDuplicate}
      />
    </div>
  );
}