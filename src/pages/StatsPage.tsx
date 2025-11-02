import React, { useEffect, useState } from 'react';
import api, { LeaderboardItem } from '../api';
import { Card, CardHeader } from '../components/ui/Card';

export default function StatsPage() {
  const [leaders, setLeaders] = useState<{ threeDA: LeaderboardItem[]; checkout: LeaderboardItem[]; tons: LeaderboardItem[] }>({ threeDA: [], checkout: [], tons: [] });
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [a, b, c] = await Promise.all([
          api.leaderboards('3da'),
          api.leaderboards('checkout_pct'),
          api.leaderboards('180s'),
        ]);
        setLeaders({ threeDA: a, checkout: b, tons: c });
      } catch (e: any) { setErr(e.message); }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">Stats</h1>
      {err && <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <LeaderboardCard title="3-Dart Avg" items={leaders.threeDA} suffix="" />
        <LeaderboardCard title="Checkout %" items={leaders.checkout} suffix="%" />
        <LeaderboardCard title="180s" items={leaders.tons} suffix="" />
      </div>
    </main>
  );
}

function LeaderboardCard({ title, items, suffix }: { title: string; items: LeaderboardItem[]; suffix: string }) {
  return (
    <Card>
      <CardHeader title={title} />
      <ul className="space-y-1 text-sm">
        {items.map((it) => (
          <li key={it.playerId} className="flex items-center justify-between">
            <span className="truncate">{it.nickname}</span>
            <span className="font-medium">{it.value}{suffix}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-neutral-600">No data yet.</li>}
      </ul>
    </Card>
  );
}
