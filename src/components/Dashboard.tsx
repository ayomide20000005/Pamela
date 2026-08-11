import { useStories } from "../hooks/useStories";
import AddStoryForm from "./AddStoryForm";
import StoryCard from "./StoryCard";

interface DashboardProps {
  profileName: string;
  isDark: boolean;
  toggleTheme: () => void;
  onLock: () => void;
}

export default function Dashboard({ profileName, isDark, toggleTheme, onLock }: DashboardProps) {
  const { stories, loading, error, addStory, deleteStory } = useStories();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-6 md:px-10">
      <header className="flex justify-between items-center mb-8">
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

      <div className="max-w-2xl mx-auto">
        <AddStoryForm onAdd={(content, source) => addStory({ content, source })} />

        {loading && <p className="text-sm">Loading stories...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && stories.length === 0 && (
          <p className="text-sm opacity-60">No stories yet — paste one above to get started.</p>
        )}

        {stories.map((story) => (
          <StoryCard key={story.id} story={story} onDelete={deleteStory} />
        ))}
      </div>
    </div>
  );
}