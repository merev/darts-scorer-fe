// src/pages/StatsPage.tsx
import React, { useEffect, useState } from 'react';
import api, { LeaderboardItem } from '../api';
import { Card, CardHeader } from '../components/ui/Card';

function toArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

type Leaders = {
  threeDA: LeaderboardItem[];
  checkout: LeaderboardItem[];
  tons: LeaderboardItem[];
};

export default function StatsPage() {
  const [leaders, setLeaders] = useState<Leaders>({ threeDA: [], checkout: [], tons: [] });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [a, b, c] = await Promise.all([
          api.leaderboards('3da'),
          api.leaderboards('checkout_pct'),
          api.leaderboards('180s'),
        ]);
        if (!cancelled) {
          setLeaders({
            threeDA: toArray<LeaderboardItem>(a),
            checkout: toArray<LeaderboardItem>(b),
            tons: toArray<LeaderboardItem>(c),
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message ?? 'Failed to load leaderboards');
          setLeaders({ threeDA: [], checkout: [], tons: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">Stats</h1>

      {err && (
        <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <LeaderboardCard title="3-Dart Avg" items={leaders.threeDA} suffix="" loading={loading} />
        <LeaderboardCard title="Checkout %" items={leaders.checkout} suffix="%" loading={loading} />
        <LeaderboardCard title="180s" items={leaders.tons} suffix="" loading={loading} />
      </div>
    </main>
  );
}

function LeaderboardCard({
  title,
  items,
  suffix,
  loading,
}: {
  title: string;
  items: LeaderboardItem[];
  suffix: string;
  loading?: boolean;
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Card>
      <CardHeader title={title} />
      <ul className="space-y-1 text-sm">
        {safeItems.map((it) => (
          <li key={it.playerId} className="flex items-center justify-between">
            <span className="truncate">{it.nickname}</span>
            <span className="font-medium">
              {it.value}
              {suffix}
            </span>
          </li>
        ))}

        {!loading && safeItems.length === 0 && (
          <li className="text-neutral-600">No data yet.</li>
        )}

        {loading && (
          <li className="text-neutral-600">Loading…</li>
        )}
      </ul>
    </Card>
  );
}
