import { useState } from "react";
import type { StorySource } from "../types/story";

interface AddStoryFormProps {
  onAdd: (content: string, source: StorySource) => void;
}

export default function AddStoryForm({ onAdd }: AddStoryFormProps) {
  const [content, setContent] = useState("");
  const [source, setSource] = useState<StorySource>("whatsapp");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content.trim(), source);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border p-4 mb-6 bg-[var(--color-surface)] border-[var(--color-border)] shadow-sm"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste a story here..."
        className="w-full min-h-[100px] p-3 rounded-lg border border-[var(--color-border)] bg-transparent text-sm resize-none outline-none focus:border-[var(--color-primary)]"
      />
      <div className="flex justify-between items-center mt-3">
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as StorySource)}
          className="text-xs rounded-md border border-[var(--color-border)] bg-transparent px-2 py-1"
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="telegram">Telegram</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm text-white bg-[var(--color-primary)] hover:opacity-90"
        >
          Add Story
        </button>
      </div>
    </form>
  );
}