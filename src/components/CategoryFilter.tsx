import type { StoryCategory } from "../types/story";

const CATEGORIES: (StoryCategory | "all")[] = [
  "all", "politics", "business", "sports", "entertainment",
  "health", "technology", "world", "local", "uncategorized",
];

interface CategoryFilterProps {
  selected: StoryCategory | "all";
  onSelect: (category: StoryCategory | "all") => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`text-xs px-3 py-1.5 rounded-full capitalize border transition ${
            selected === category
              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}