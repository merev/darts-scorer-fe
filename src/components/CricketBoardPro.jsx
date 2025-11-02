// src/components/CricketBoardPro.jsx
import React from "react";
import { Card } from "./ui/Card";

/** CricketBoardPro
 * Enhancements over CricketBoard:
 * - Highlights active target row (activeTarget)
 * - Highlights current player (activePlayerId)
 * - Shows per-turn marks (turnMarks: { [playerId]: {num:number}[] })
 * Props:
 * - players: [{id, nickname}]
 * - marks: { [playerId]: { 20:number,19:number,18:number,17:number,16:number,15:number,BULL:number } }
 * - points: { [playerId]: number }
 * - activeTarget?: 20|19|18|17|16|15|'BULL'
 * - activePlayerId?: string
 * - turnMarks?: { [playerId]: Array<{ target: number | 'BULL', mult: 1|2|3 }> }
 */
export default function CricketBoardPro({ players = [], marks = {}, points = {}, activeTarget, activePlayerId, turnMarks = {} }) {
  const rows = [20,19,18,17,16,15,'BULL'];
  const markIcon = (v=0) => v >= 3 ? '✕✕✕' : v === 2 ? '✕✕' : v === 1 ? '✕' : '—';

  return (
    <Card>
      <div className="mb-2 text-sm font-semibold">Cricket</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">#</th>
              {players.map(p => (
                <th key={p.id} className={`px-3 py-2 ${p.id === activePlayerId ? 'bg-neutral-50' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{p.nickname}</span>
                    {Array.isArray(turnMarks[p.id]) && turnMarks[p.id].length > 0 && (
                      <span className="text-[11px] text-neutral-500">
                        {turnMarks[p.id].map((m,i)=>fmtMark(m)).join(', ')}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r)} className={`border-b last:border-0 ${r === activeTarget ? 'bg-yellow-50' : ''}`}>
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
    </Card>
  );
}

function fmtMark({ target, mult }) {
  const t = target === 'BULL' ? 'Bull' : target;
  if (mult === 3) return `T${t}`;
  if (mult === 2) return `D${t}`;
  return `${t}`;
}
