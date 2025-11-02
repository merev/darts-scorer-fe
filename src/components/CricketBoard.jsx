import React from "react";


/** CricketBoard
* Props:
* - players: [{id, nickname}]
* - marks: { [playerId]: { 20:number,19:number,18:number,17:number,16:number,15:number,BULL:number } }
* - points: { [playerId]: number }
* - closed: { 20:boolean,19:boolean,18:boolean,17:boolean,16:boolean,15:boolean,BULL:boolean } // optional (global closed)
*/
export function CricketBoard({ players = [], marks = {}, points = {}, closed = {} }) {
const rows = [20,19,18,17,16,15,'BULL'];
const markIcon = (v=0) => {
if (v >= 3) return '✕✕✕';
if (v === 2) return '✕✕';
if (v === 1) return '✕';
return '—';
};
return (
<div className="mb-3 overflow-x-auto rounded-2xl border">
<table className="w-full text-sm">
<thead>
<tr className="border-b text-left">
<th className="px-3 py-2">#</th>
{players.map(p => (
<th key={p.id} className="px-3 py-2">{p.nickname}</th>
))}
</tr>
</thead>
<tbody>
{rows.map((r) => (
<tr key={String(r)} className="border-b last:border-0">
<td className="px-3 py-2 font-medium">{String(r)}</td>
{players.map(p => (
<td key={p.id+':'+r} className="px-3 py-2">
<span className="inline-block min-w-[3ch] text-center">
{markIcon(marks?.[p.id]?.[r] || 0)}
</span>
</td>
))}
</tr>
))}
<tr>
<td className="px-3 py-2 font-semibold">Points</td>
{players.map(p => (
<td key={p.id+':pts'} className="px-3 py-2 font-semibold">{points?.[p.id] ?? 0}</td>
))}
</tr>
</tbody>
</table>
</div>
);
}