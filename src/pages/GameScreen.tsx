// src/pages/GameScreen.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ScorePadV2 from "../components/ScorePadV2.jsx";
import { TurnBanner } from "../components/TurnBanner.jsx";
import { X01Board } from "../components/X01Board.jsx";
import CricketBoardPro from "../components/CricketBoardPro.jsx";
import CheckoutBadge from "../components/CheckoutBadge.jsx";
import api, { Game, UUID } from "../api.js";
import { useGameSocket } from "../hooks/useGameSocket.js";

export default function GameScreen() {
  const { gameId = "" } = useParams<{ gameId: UUID }>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<Game | null>(null);

  const players = data?.players || [];
  const state = data?.state || {} as Game['state'];
  const current = useMemo(() => players.find(p => p.id === state.currentPlayerId), [players, state.currentPlayerId]);

  const title = useMemo(() => {
    if (!data) return "Game";
    const leg = state.legNo ? ` · Leg ${state.legNo}` : "";
    return `${data.format}${leg}`;
  }, [data, state.legNo]);

  const refresh = useCallback(async () => {
    try {
      const j = await api.getGame(gameId);
      setData(j);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load game");
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [refresh]);

  useGameSocket(gameId, (msg: any) => {
    if (msg?.type === 'state' && msg.payload) setData(msg.payload as Game);
  });

  async function sendThrow({ segment, mult }: { segment: number | 25 | 50 | 0; mult: 1 | 2 | 3 }) {
    try {
      await api.throw(gameId, { segment, mult });
    } catch (e: any) { setErr(e?.message || 'Failed to submit throw'); }
  }
  async function sendMiss() { return sendThrow({ segment: 0, mult: 1 }); }
  async function undo() { try { await api.undo(gameId); } catch (e: any) { setErr(e?.message || 'Failed to undo'); } }

  if (loading) return <main className="mx-auto max-w-5xl p-4 sm:p-6"><p>Loading…</p></main>;
  if (err) return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{String(err)}</div>
      <button onClick={refresh} className="rounded-xl border px-3 py-1 hover:shadow">Retry</button>
    </main>
  );

  const isX01 = data?.format === 'X01';
  const isCricket = data?.format === 'CRICKET';

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <header className="mb-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {state?.winner && (
          <div className="rounded-xl border px-3 py-1 text-sm">
            Winner: <span className="font-semibold">{state.winner.nickname}</span>
          </div>
        )}
      </header>

      <TurnBanner currentPlayerName={current?.nickname} checkoutHint={null} />
      {state.checkoutHint && (
        <div className="mb-3"><CheckoutBadge hint={state.checkoutHint} /></div>
      )}

      {isX01 && (
        <X01Board players={players} scores={state.scores || {}} lastTurns={state.lastTurns || {}} />
      )}

      {isCricket && (
        <CricketBoardPro
          players={players}
          marks={state.marks || {}}
          points={state.points || {}}
          activeTarget={state.activeTarget}
          activePlayerId={state.currentPlayerId}
          turnMarks={state.turnMarks || {}}
        />
      )}

      {Array.isArray(state?.events) && state.events.length > 0 && (
        <div className="mb-3 rounded-2xl border p-3 text-sm">
          <div className="mb-1 font-medium">Recent events</div>
          <ul className="list-disc pl-5 text-neutral-700">
            {(state.events as string[]).slice(-8).reverse().map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </div>
      )}

      <ScorePadV2
        dartsLeft={state.dartsLeftInTurn ?? 3}
        onThrow={sendThrow}
        onMiss={sendMiss}
        onUndo={undo}
        onEndTurn={() => {}}
      />
    </main>
  );
}
