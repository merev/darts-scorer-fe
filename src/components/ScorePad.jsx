import React, { useEffect, useMemo, useState } from "react";


/**
* ScorePad — per-dart keypad with keyboard shortcuts
* Props:
* - dartsLeft (1..3)
* - onThrow({ segment: number | 25 | 50, mult: 1|2|3 })
* - onMiss()
* - onUndo()
* - onEndTurn() // when entering totals-per-turn mode, can be used to advance
*/
export function ScorePad({ dartsLeft = 3, onThrow, onMiss, onUndo, onEndTurn }) {
const [mult, setMult] = useState(1); // 1=S, 2=D, 3=T


// keyboard shortcuts
useEffect(() => {
function onKey(e) {
if (e.repeat) return;
if (/^\d$/.test(e.key)) {
const n = parseInt(e.key, 10);
if (n >= 0 && n <= 9) {
if (n === 0) return; // ignore 0
}
}
if (e.key >= '1' && e.key <= '9') {
const n = parseInt(e.key, 10);
if (n >= 1 && n <= 9) {
handleNumber(n);
}
}
if (e.key === '0') handleNumber(10); // 10 with 0
if (e.key === '-') handleNumber(11); // quick mapping for 11
if (e.key === '=') handleNumber(12); // quick mapping for 12
if (e.key.toLowerCase() === 'd') setMult((m) => (m === 2 ? 1 : 2));
if (e.key.toLowerCase() === 't') setMult((m) => (m === 3 ? 1 : 3));
if (e.key.toLowerCase() === 'b') onThrow?.({ segment: 25, mult: 1 });
if (e.key.toLowerCase() === 'm') onMiss?.();
if (e.key.toLowerCase() === 'u') onUndo?.();
if (e.key === 'Enter') onEndTurn?.();
}
window.addEventListener('keydown', onKey);
return () => window.removeEventListener('keydown', onKey);
}, [onThrow, onMiss, onUndo, onEndTurn]);


const numbers = useMemo(() => [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], []);


function handleNumber(n) {
onThrow?.({ segment: n, mult });
}


return (
<div className="rounded-2xl border p-3">
<div className="mb-2 flex items-center justify-between">
<div className="text-sm text-neutral-600">Darts left: <span className="font-medium text-neutral-900">{dartsLeft}</span></div>
<div className="flex items-center gap-2">
<button
type="button"
onClick={() => setMult(mult === 2 ? 1 : 2)}
className={"rounded-xl border px-3 py-1 text-sm " + (mult === 2 ? "border-black shadow" : "border-neutral-300")}
aria-pressed={mult === 2}
title="Toggle Double (D)"
>D</button>
<button
type="button"
onClick={() => setMult(mult === 3 ? 1 : 3)}
className={"rounded-xl border px-3 py-1 text-sm " + (mult === 3 ? "border-black shadow" : "border-neutral-300")}
aria-pressed={mult === 3}
title="Toggle Triple (T)"
>T</button>
</div>
</div>


<div className="grid grid-cols-5 gap-2">
{numbers.map((n) => (
<button key={n} type="button" onClick={() => handleNumber(n)}
className="rounded-xl border px-3 py-2 font-medium hover:shadow"
>{n}</button>
))}
<button type="button" onClick={() => onThrow?.({ segment: 25, mult: 1 })}
className="col-span-2 rounded-xl border px-3 py-2 font-medium hover:shadow">Bull (25)</button>
<button type="button" onClick={() => onThrow?.({ segment: 50, mult: 1 })}
className="col-span-1 rounded-xl border px-3 py-2 font-medium hover:shadow">Inner (50)</button>
<button type="button" onClick={onMiss}
className="col-span-1 rounded-xl border px-3 py-2 font-medium hover:shadow">Miss</button>
<button type="button" onClick={onUndo}
className="col-span-1 rounded-xl border px-3 py-2 font-medium hover:shadow">Undo</button>
</div>


<div className="mt-3 flex justify-end">
<button type="button" onClick={onEndTurn} className="rounded-2xl border px-4 py-2 hover:shadow">End Turn ↩︎</button>
</div>
</div>
);
}