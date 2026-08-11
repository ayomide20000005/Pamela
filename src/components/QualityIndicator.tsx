import type { StoryQuality } from "../types/story";

interface QualityIndicatorProps {
  quality: StoryQuality;
  notes?: string | null;
  onChange: (quality: StoryQuality) => void;
}

const QUALITY_OPTIONS: { value: StoryQuality; label: string; color: string }[] = [
  { value: "strong", label: "Strong", color: "bg-green-200 text-green-800" },
  { value: "average", label: "Average", color: "bg-yellow-200 text-yellow-800" },
  { value: "weak", label: "Weak", color: "bg-red-200 text-red-800" },
  { value: "unrated", label: "Unrated", color: "bg-gray-200 text-gray-700" },
];

export default function QualityIndicator({ quality, notes, onChange }: QualityIndicatorProps) {
  return (
    <div className="mt-3">
      <div className="flex gap-2">
        {QUALITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-xs px-2 py-1 rounded-full transition ${
              quality === opt.value ? opt.color : "opacity-40 hover:opacity-70"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {notes && <p className="text-xs opacity-60 mt-1 italic">{notes}</p>}
    </div>
  );
}