import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import GameScreen from "./pages/GameScreen"; // .tsx
import PlayersPage from "./pages/PlayersPage"; // still .jsx (works) or .tsx if converted
import StatsPage from "./pages/StatsPage"; // .tsx

// If NewGameWizard is JS, TS can still import default.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NewGameWizard from "./NewGameWizard";

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold">🎯 Darts</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:underline" to="/new">New Game</Link>
          <Link className="hover:underline" to="/players">Players</Link>
          <Link className="hover:underline" to="/stats">Stats</Link>
        </nav>
      </div>
    </header>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">Welcome</h1>
      <p className="mb-6 text-neutral-600">Start a new match or browse stats.</p>
      <div className="flex gap-3">
        <button onClick={() => navigate("/new")} className="rounded-2xl border px-4 py-2 font-medium hover:shadow">New Game</button>
        <button onClick={() => navigate("/players")} className="rounded-2xl border px-4 py-2 font-medium hover:shadow">Players</button>
      </div>
    </main>
  );
}

function NewGamePage() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">New Game</h1>
      <React.Suspense fallback={<p className="text-neutral-600">Loading…</p>}>
        <NewGameWizard onCreated={(id: string) => navigate(`/g/${id}`)} />
      </React.Suspense>
    </main>
  );
}

export default function AppShell() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-white text-neutral-900">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewGamePage />} />
          <Route path="/g/:gameId" element={<GameScreen />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
