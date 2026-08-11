import { Story } from "../types/story";

interface DuplicateBadgeProps {
  story: Story;
  allStories: Story[];
  onMarkDuplicate: (id: string, duplicateOfId: string | null) => void;
}

export default function DuplicateBadge({ story, allStories, onMarkDuplicate }: DuplicateBadgeProps) {
  const originalStory = story.duplicate_of
    ? allStories.find((s) => s.id === story.duplicate_of)
    : null;

  if (!story.is_duplicate) {
    return null;
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-xs rounded-lg bg-red-100 text-red-800 px-3 py-2">
      <span>
        Possible duplicate{originalStory ? ` of: "${originalStory.content.slice(0, 40)}..."` : ""}
      </span>
      <button
        onClick={() => onMarkDuplicate(story.id, null)}
        className="ml-auto underline hover:opacity-70"
      >
        Not a duplicate
      </button>
    </div>
  );
}