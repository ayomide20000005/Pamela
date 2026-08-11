import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import AuthGate from "./components/AuthGate";
import Dashboard from "./components/Dashboard";

export default function App() {
  const auth = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        Loading...
      </div>
    );
  }

  if (!auth.unlocked) {
    return <AuthGate auth={auth} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  return (
    <Dashboard
      profileName={auth.profile?.name ?? "there"}
      isDark={isDark}
      toggleTheme={toggleTheme}
      onLock={auth.lock}
    />
  );
}