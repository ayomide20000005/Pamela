import { useState } from "react";
import type { Story } from "../types/story";

interface BulletinBuilderProps {
  stories: Story[];
}

export default function BulletinBuilder({ stories }: BulletinBuilderProps) {
  const [order, setOrder] = useState<string[]>(stories.map((s) => s.id));
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const orderedStories = order
    .map((id) => stories.find((s) => s.id === id))
    .filter((s): s is Story => Boolean(s));

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === overId) return;

    setOrder((prev) => {
      const next = [...prev];
      const fromIndex = next.indexOf(draggedId);
      const toIndex = next.indexOf(overId);
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, draggedId);
      return next;
    });
  };

  const handleDragEnd = () => setDraggedId(null);

  const strongOnly = orderedStories.filter((s) => s.quality === "strong").length;

  return (
    <div className="rounded-xl border p-4 bg-[var(--color-surface)] border-[var(--color-border)] shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Today's Bulletin Order</h2>
        <span className="text-xs opacity-60">{strongOnly} strong stories selected</span>
      </div>

      {orderedStories.length === 0 && (
        <p className="text-sm opacity-60">No stories to arrange yet.</p>
      )}

      <div>
        {orderedStories.map((story, index) => (
          <div
            key={story.id}
            draggable
            onDragStart={() => handleDragStart(story.id)}
            onDragOver={(e) => handleDragOver(e, story.id)}
            onDragEnd={handleDragEnd}
            className={`flex items-start gap-3 p-3 mb-2 rounded-lg border cursor-move ${
              draggedId === story.id
                ? "opacity-40 border-[var(--color-primary)]"
                : "border-[var(--color-border)]"
            }`}
          >
            <span className="text-xs font-semibold opacity-50 mt-0.5">{index + 1}</span>
            <div className="flex-1">
              <p className="text-sm line-clamp-2">{story.content}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white capitalize">
                  {story.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] capitalize">
                  {story.quality}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}