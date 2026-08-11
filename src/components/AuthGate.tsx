import { useState } from "react";
import { UseAuthReturn } from "../hooks/useAuth";

interface AuthGateProps {
  auth: ReturnType<typeof import("../hooks/useAuth").useAuth>;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function AuthGate({ auth, isDark, toggleTheme }: AuthGateProps) {
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError("Please enter your name.");
      return;
    }
    if (passcode.length < 4) {
      setLocalError("Passcode must be at least 4 characters.");
      return;
    }
    if (passcode !== confirmPasscode) {
      setLocalError("Passcodes don't match.");
      return;
    }

    await auth.setupProfile({ name: name.trim(), passcode });
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const success = auth.enterPasscode(enteredPasscode);
    if (!success) {
      setLocalError("Incorrect passcode. Try again.");
      setEnteredPasscode("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] px-4">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 text-xs px-3 py-2 rounded-lg border border-[var(--color-border)]"
      >
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div className="w-full max-w-sm rounded-xl border p-6 bg-[var(--color-surface)] border-[var(--color-border)] shadow-sm">
        {auth.needsSetup ? (
          <>
            <h1 className="text-lg font-semibold mb-1">Welcome to Pamela 🌷</h1>
            <p className="text-sm opacity-60 mb-4">Let's set things up, just this once.</p>

            <form onSubmit={handleSetup} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
              />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Set a passcode"
                className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
              />
              <input
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Confirm passcode"
                className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
              />

              {localError && <p className="text-xs text-red-500">{localError}</p>}

              <button
                type="submit"
                className="w-full py-2 rounded-lg text-sm text-white bg-[var(--color-primary)] hover:opacity-90"
              >
                Get Started
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold mb-1">Welcome back 🌷</h1>
            <p className="text-sm opacity-60 mb-4">Enter your passcode to continue.</p>

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                value={enteredPasscode}
                onChange={(e) => setEnteredPasscode(e.target.value)}
                placeholder="Passcode"
                autoFocus
                className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
              />

              {localError && <p className="text-xs text-red-500">{localError}</p>}

              <button
                type="submit"
                className="w-full py-2 rounded-lg text-sm text-white bg-[var(--color-primary)] hover:opacity-90"
              >
                Unlock
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}