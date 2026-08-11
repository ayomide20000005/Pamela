import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Story, NewStoryInput, StoryCategory, StoryQuality } from "../types/story";

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setStories(data as Story[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const addStory = useCallback(
    async (input: NewStoryInput) => {
      const { data, error } = await supabase
        .from("stories")
        .insert([{ content: input.content, source: input.source }])
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      setStories((prev) => [data as Story, ...prev]);
      return data as Story;
    },
    []
  );

  const updateStory = useCallback(
    async (id: string, updates: Partial<Story>) => {
      const { data, error } = await supabase
        .from("stories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      setStories((prev) => prev.map((s) => (s.id === id ? (data as Story) : s)));
      return data as Story;
    },
    []
  );

  const deleteStory = useCallback(async (id: string) => {
    const { error } = await supabase.from("stories").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return false;
    }

    setStories((prev) => prev.filter((s) => s.id !== id));
    return true;
  }, []);

  const setCategory = useCallback(
    (id: string, category: StoryCategory) => updateStory(id, { category }),
    [updateStory]
  );

  const setQuality = useCallback(
    (id: string, quality: StoryQuality, quality_notes?: string) =>
      updateStory(id, { quality, quality_notes: quality_notes ?? null }),
    [updateStory]
  );

  const markDuplicate = useCallback(
    (id: string, duplicateOfId: string | null) =>
      updateStory(id, {
        is_duplicate: duplicateOfId !== null,
        duplicate_of: duplicateOfId,
      }),
    [updateStory]
  );

  return {
    stories,
    loading,
    error,
    fetchStories,
    addStory,
    updateStory,
    deleteStory,
    setCategory,
    setQuality,
    markDuplicate,
  };
}