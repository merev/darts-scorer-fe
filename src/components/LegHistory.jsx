import React from 'react';

/** LegHistory — compact event log for a leg
 * Props:
 *  - events: string[] | { ts?:string, text:string }[]
 */
export default function LegHistory({ events = [] }) {
  const rows = events.map((e) => typeof e === 'string' ? { text: e } : e);
  if (rows.length === 0) return null;
  return (
    <div className="mb-3 rounded-2xl border p-3 text-sm">
      <div className="mb-1 font-medium">Leg history</div>
      <ul className="space-y-1 text-neutral-700 max-h-60 overflow-auto pr-1">
        {rows.map((ev, i) => (
          <li key={i} className="flex items-start justify-between gap-3">
            <span className="truncate">{ev.text}</span>
            {ev.ts && <span className="shrink-0 text-xs text-neutral-500">{fmtTime(ev.ts)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function fmtTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}
