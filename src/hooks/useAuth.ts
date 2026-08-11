import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Profile, SetupProfileInput } from "../types/profile";

const SESSION_KEY = "pamela_unlocked";

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();

    if (error) {
      setError(error.message);
    } else {
      setProfile(data as Profile | null);
    }

    const savedSession = sessionStorage.getItem(SESSION_KEY);
    if (savedSession === "true") {
      setUnlocked(true);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const setupProfile = useCallback(async (input: SetupProfileInput) => {
    const { data, error } = await supabase
      .from("profile")
      .insert([{ name: input.name, passcode: input.passcode }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return false;
    }

    setProfile(data as Profile);
    setUnlocked(true);
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }, []);

  const enterPasscode = useCallback(
    (passcode: string) => {
      if (!profile) return false;

      if (profile.passcode === passcode) {
        setUnlocked(true);
        sessionStorage.setItem(SESSION_KEY, "true");
        return true;
      }

      setError("Incorrect passcode.");
      return false;
    },
    [profile]
  );

  const lock = useCallback(() => {
    setUnlocked(false);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return {
    profile,
    loading,
    unlocked,
    error,
    needsSetup: !loading && profile === null,
    setupProfile,
    enterPasscode,
    lock,
  };
}