import { useState } from "react";
import { useStories } from "../hooks/useStories";
import type { StoryCategory } from "../types/story";
import AddStoryForm from "./AddStoryForm";
import StoryCard from "./StoryCard";
import CategoryFilter from "./CategoryFilter";
import BulletinBuilder from "./BulletinBuilder";
import FindMoreNews from "./FindMoreNews";

interface DashboardProps {
  profileName: string;
  isDark: boolean;
  toggleTheme: () => void;
  onLock: () => void;
}

type Tab = "workspace" | "bulletin" | "find-more";

export default function Dashboard({ profileName, isDark, toggleTheme, onLock }: DashboardProps) {
  const { stories, loading, error, addStory, deleteStory, setCategory, setQuality, markDuplicate } =
    useStories();

  const [tab, setTab] = useState<Tab>("workspace");
  const [categoryFilter, setCategoryFilter] = useState<StoryCategory | "all">("all");

  const visibleStories =
    categoryFilter === "all" ? stories : stories.filter((s) => s.category === categoryFilter);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-6 md:px-10">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Hi, {profileName} 🌷</h1>
        <div className="flex gap-3">
          <button
            onClick={toggleTheme}
            className="text-xs px-3 py-2 rounded-lg border border-[var(--color-border)]"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            onClick={onLock}
            className="text-xs px-3 py-2 rounded-lg border border-[var(--color-border)]"
          >
            Lock
          </button>
        </div>
      </header>

      <div className="flex gap-2 mb-6 max-w-2xl mx-auto">
        {(["workspace", "bulletin", "find-more"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm px-4 py-2 rounded-lg border capitalize ${
              tab === t
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "border-[var(--color-border)]"
            }`}
          >
            {t === "find-more" ? "Find More News" : t}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {tab === "workspace" && (
          <>
            <AddStoryForm onAdd={(content, source) => addStory({ content, source })} />

            <CategoryFilter selected={categoryFilter} onSelect={setCategoryFilter} />

            {loading && <p className="text-sm">Loading stories...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && visibleStories.length === 0 && (
              <p className="text-sm opacity-60">No stories here yet.</p>
            )}

            {visibleStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                allStories={stories}
                onDelete={deleteStory}
                onCategoryChange={setCategory}
                onQualityChange={setQuality}
                onMarkDuplicate={markDuplicate}
              />
            ))}
          </>
        )}

        {tab === "bulletin" && <BulletinBuilder stories={stories} />}

        {tab === "find-more" && (
          <FindMoreNews onImport={(input) => addStory(input)} />
        )}
      </div>
    </div>
  );
}