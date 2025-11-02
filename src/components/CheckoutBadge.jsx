import React from 'react';

/** CheckoutBadge
 * Displays checkout suggestions as compact pills.
 * Props:
 *  - hint: string | string[] | null  // e.g. "T20 T20 Bull" or ["T20 T20 Bull","T20 T18 D16"]
 *  - title?: string                   // defaults to 'Checkout'
 */
export default function CheckoutBadge({ hint, title = 'Checkout' }) {
  const routes = normalize(hint);
  if (!routes.length) return null;
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
      <span className="font-medium text-neutral-800">{title}:</span>
      <div className="flex flex-wrap gap-1">
        {routes.map((r, i) => (
          <span key={i} className="rounded-full border px-2 py-[2px] text-[12px]">
            {r}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => copy(routes.join(' | '))}
        className="ml-1 rounded-full border px-2 py-[2px] text-[12px] hover:shadow"
        title="Copy suggestions"
      >Copy</button>
    </div>
  );
}

function normalize(hint) {
  if (!hint) return [];
  if (Array.isArray(hint)) return hint.filter(Boolean);
  // Allow backends to send a single string with separators
  const s = String(hint).trim();
  if (!s) return [];
  // split by | ; , or newline if present
  const parts = s.split(/[|;\n,]+/).map(x => x.trim()).filter(Boolean);
  return parts.length ? parts : [s];
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore clipboard failure
  }
}
