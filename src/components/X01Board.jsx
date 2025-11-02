import React from "react";
/** X01Board — shows each player's remaining score and last turn */
export function X01Board({ players = [], scores = {}, lastTurns = {} }) {
return (
<div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
{players.map((p) => (
<div key={p.id} className="rounded-2xl border p-3">
<div className="flex items-baseline justify-between">
<div>
<div className="text-sm text-neutral-600">{p.nickname}</div>
<div className="text-3xl font-bold">{scores[p.id] ?? "—"}</div>
</div>
<div className="text-right text-sm text-neutral-600">
<div className="uppercase tracking-wide text-[11px] text-neutral-500">Last turn</div>
<div>{lastTurns[p.id] ?? "—"}</div>
</div>
</div>
</div>
))}
</div>
);
}