import type { Story } from "../types/story";

interface StoryCardProps {
  story: Story;
  onDelete: (id: string) => void;
}

export default function StoryCard({ story, onDelete }: StoryCardProps) {
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
      <div className="flex gap-2 mt-3 text-xs">
        <span className="px-2 py-1 rounded-full bg-[var(--color-primary)] text-white capitalize">
          {story.category}
        </span>
        <span className="px-2 py-1 rounded-full border border-[var(--color-border)] capitalize">
          {story.quality}
        </span>
        <span className="px-2 py-1 rounded-full border border-[var(--color-border)] capitalize">
          {story.source}
        </span>
        {story.is_duplicate && (
          <span className="px-2 py-1 rounded-full bg-red-200 text-red-800">Duplicate</span>
        )}
      </div>
    </div>
  );
}