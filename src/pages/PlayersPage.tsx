// src/pages/PlayersPage.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api, { Player } from "../api";

// Defensive: whatever the backend (or mock) returns, make it an array of Player
function normalizePlayers(input: unknown): Player[] {
  if (Array.isArray(input)) return input as Player[];
  if (input && Array.isArray((input as any).players)) return (input as any).players as Player[];
  return [];
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const raw = await api.listPlayers();     // may be [], {players:[...]}, null, etc. in prod
      setPlayers(normalizePlayers(raw));
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load players');
      setPlayers([]);                          // keep it an array so render never crashes
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    const n = name.trim(); if (!n) return;
    try {
      setLoading(true);
      await api.createPlayer(n);
      setName('');
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to add player');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      setLoading(true);
      await api.deletePlayer(id);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to delete player');
    } finally {
      setLoading(false);
    }
  }

  const safePlayers = Array.isArray(players) ? players : [];  // last line of defense

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">Players</h1>

      <Card className="mb-4">
        <CardHeader title="Add player" />
        <div className="flex gap-2">
          <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nickname" />
          <Button onClick={add} disabled={loading}>Add</Button>
        </div>
      </Card>

      {err && <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

      <Card>
        <CardHeader title="All players" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-3 py-2">Nickname</th>
                <th className="w-24 px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safePlayers.map(p => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-3 py-2">{p.nickname}</td>
                  <td className="px-3 py-2">
                    <Button variant="danger" size="sm" onClick={()=>remove(p.id)} disabled={loading}>Delete</Button>
                  </td>
                </tr>
              ))}
              {safePlayers.length === 0 && !loading && (
                <tr><td className="px-3 py-3 text-neutral-600" colSpan={2}>No players yet.</td></tr>
              )}
              {loading && (
                <tr><td className="px-3 py-3 text-neutral-600" colSpan={2}>Loading…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
