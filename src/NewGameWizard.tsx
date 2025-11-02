// src/NewGameWizard.tsx
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardSection } from "./components/ui/Card";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import api, { GameFormat } from "./api";

// Types for payload we send to the backend
export interface CreateGamePayload {
  format: GameFormat;
  variant: Record<string, unknown>;
  players: string[]; // we use nicknames for personal use; your backend can map to IDs
  order?: string[];
  best_of?: number;
  first_to?: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const clamp = (n: number, mi: number, ma: number) => Math.max(mi, Math.min(ma, n));

export default function NewGameWizard({ onCreated }: { onCreated: (gameId: string) => void }) {
  const [format, setFormat] = useState<GameFormat>("X01");
  const [x01Points, setX01Points] = useState<number>(501);
  const [x01DoubleOut, setX01DoubleOut] = useState<boolean>(true);
  const [x01DoubleIn, setX01DoubleIn] = useState<boolean>(false);
  const [cricketCutthroat, setCricketCutthroat] = useState<boolean>(false);
  const [bestOf, setBestOf] = useState<number>(3);
  const [firstTo, setFirstTo] = useState<number | undefined>(undefined);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (players.length < 2) return false;
    if (format === "X01") return x01Points > 0;
    return true;
  }, [players.length, format, x01Points]);

  const variant = useMemo<Record<string, unknown>>(() => {
    switch (format) {
      case "X01":
        return { x01: x01Points, double_out: x01DoubleOut, double_in: x01DoubleIn };
      case "CRICKET":
        return { cutthroat: cricketCutthroat };
      case "AROUND_THE_WORLD":
        return { sequence: "1-20-BULL" };
      case "SHANGHAI":
        return { rounds: 7 };
      default:
        return {};
    }
  }, [format, x01Points, x01DoubleOut, x01DoubleIn, cricketCutthroat]);

  function addPlayer() {
    const n = playerInput.trim();
    if (!n) return;
    if (players.includes(n)) {
      setPlayerInput("");
      return;
    }
    const updated = [...players, n];
    setPlayers(updated);
    setOrder(updated);
    setPlayerInput("");
  }
  function removePlayer(name: string) {
    const updated = players.filter((p) => p !== name);
    setPlayers(updated);
    setOrder((o) => o.filter((p) => p !== name));
  }
  function randomizeOrder() {
    setOrder((o) => shuffle(o));
  }

  async function createGame() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateGamePayload = {
        format,
        variant,
        players,
        order,
        ...(firstTo ? { first_to: clamp(firstTo, 1, 20) } : {}),
        ...(bestOf ? { best_of: clamp(bestOf, 1, 19) } : {}),
      };
      const res = await api.createGame(payload);
      onCreated(res.id);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create game");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold">New Game</h1>

      <Card className="mb-4">
        <CardHeader title="Format" hint="Choose game type" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["X01", "CRICKET", "AROUND_THE_WORLD", "SHANGHAI"] as GameFormat[]).map((f) => (
            <Button key={f} onClick={() => setFormat(f)} variant={format === f ? "default" : "subtle"}>
              {labelForFormat(f)}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader title="Options" />
        {format === "X01" && (
          <CardSection>
            <div className="flex flex-wrap items-center gap-3">
              {[301, 501, 701].map((p) => (
                <Button key={p} onClick={() => setX01Points(p)} variant={x01Points === p ? "default" : "subtle"} size="sm">
                  {p}
                </Button>
              ))}
              <div className="flex items-center gap-2">
                <label className="text-sm">Custom</label>
                <Input
                  type="number"
                  min={2}
                  step={1}
                  value={x01Points}
                  onChange={(e) => setX01Points(parseInt(e.target.value || "0", 10))}
                  className="w-28"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={x01DoubleIn} onChange={(e) => setX01DoubleIn(e.target.checked)} />
                Double In
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={x01DoubleOut} onChange={(e) => setX01DoubleOut(e.target.checked)} />
                Double Out
              </label>
            </div>
          </CardSection>
        )}
        {format === "CRICKET" && (
          <CardSection>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={cricketCutthroat} onChange={(e) => setCricketCutthroat(e.target.checked)} />
              Cutthroat (points go to others)
            </label>
          </CardSection>
        )}
        {format === "AROUND_THE_WORLD" && (
          <CardSection>
            <p className="text-sm text-neutral-600">Standard sequence 1 → 20 → Bull.</p>
          </CardSection>
        )}
        {format === "SHANGHAI" && (
          <CardSection>
            <p className="text-sm text-neutral-600">7 rounds targeting 1–7. Shanghai ends game immediately.</p>
          </CardSection>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader title="Players" right={<Button variant="ghost" onClick={randomizeOrder}>Randomize</Button>} />
        <div className="mb-3 flex gap-2">
          <Input
            placeholder="Add nickname"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          />
          <Button onClick={addPlayer}>Add</Button>
        </div>
        {players.length === 0 && <p className="text-sm text-neutral-500">No players yet.</p>}
        {players.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <span key={p} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                  {p}
                  <button onClick={() => removePlayer(p)} className="text-neutral-500 hover:text-red-600" aria-label={`Remove ${p}`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <ol className="list-inside list-decimal space-y-1">
              {order.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="font-medium">{p}</span>
                  <span className="text-xs text-neutral-500">(randomized; drag-n-drop optional later)</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader title="Match Length" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-sm text-neutral-700">Best of (legs)</div>
            <Input type="number" min={1} step={2} value={bestOf} onChange={(e) => setBestOf(parseInt(e.target.value || "1", 10))} />
          </div>
          <div>
            <div className="mb-1 text-sm text-neutral-700">First to (optional)</div>
            <Input type="number" min={1} value={firstTo ?? ""} onChange={(e) => setFirstTo(e.target.value ? parseInt(e.target.value, 10) : undefined)} />
          </div>
        </div>
      </Card>

      {error && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex items-center gap-3">
        <Button onClick={createGame} disabled={!canSubmit || submitting}>
          {submitting ? "Creating…" : "Create Game"}
        </Button>
        <span className="text-xs text-neutral-500">Requires at least two players.</span>
      </div>
    </div>
  );
}

function labelForFormat(f: GameFormat) {
  switch (f) {
    case "X01":
      return "X01";
    case "CRICKET":
      return "Cricket";
    case "AROUND_THE_WORLD":
      return "Around the World";
    case "SHANGHAI":
      return "Shanghai";
  }
}
