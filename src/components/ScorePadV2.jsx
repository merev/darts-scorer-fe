// src/components/ScorePadV2.jsx
import React, { useEffect, useMemo, useState } from "react";
import Button from "./ui/Button";
import { Card } from "./ui/Card";

/** ScorePadV2
 * - Larger tap targets
 * - Sticky bottom layout friendly on mobile
 * - Keyboard shortcuts preserved
 */
export default function ScorePadV2({ dartsLeft = 3, onThrow, onMiss, onUndo, onEndTurn }) {
  const [mult, setMult] = useState(1); // 1=S, 2=D, 3=T

  useEffect(() => {
    function onKey(e) {
      if (e.repeat) return;
      if (e.key >= '1' && e.key <= '9') onThrow?.({ segment: parseInt(e.key, 10), mult });
      if (e.key === '0') onThrow?.({ segment: 10, mult });
      if (e.key.toLowerCase() === 'd') setMult((m) => (m === 2 ? 1 : 2));
      if (e.key.toLowerCase() === 't') setMult((m) => (m === 3 ? 1 : 3));
      if (e.key.toLowerCase() === 'b') onThrow?.({ segment: 25, mult: 1 });
      if (e.key.toLowerCase() === 'm') onMiss?.();
      if (e.key.toLowerCase() === 'u') onUndo?.();
      if (e.key === 'Enter') onEndTurn?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onThrow, onMiss, onUndo, onEndTurn, mult]);

  const numbers = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), []);

  return (
    <Card className="sticky bottom-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-neutral-600">Darts left: <span className="font-medium text-neutral-900">{dartsLeft}</span></div>
        <div className="flex items-center gap-2">
          <Button variant={mult===2? 'default':'subtle'} size="sm" onClick={() => setMult(mult === 2 ? 1 : 2)} title="Toggle Double (D)">D</Button>
          <Button variant={mult===3? 'default':'subtle'} size="sm" onClick={() => setMult(mult === 3 ? 1 : 3)} title="Toggle Triple (T)">T</Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {numbers.map((n) => (
          <Button key={n} onClick={() => onThrow?.({ segment: n, mult })} size="lg" variant="subtle">{n}</Button>
        ))}
        <Button onClick={() => onThrow?.({ segment: 25, mult: 1 })} className="col-span-2" size="lg" variant="subtle">Bull (25)</Button>
        <Button onClick={() => onThrow?.({ segment: 50, mult: 1 })} size="lg" variant="subtle">Inner (50)</Button>
        <Button onClick={onMiss} size="lg" variant="subtle">Miss</Button>
        <Button onClick={onUndo} size="lg" variant="danger">Undo</Button>
      </div>

      <div className="mt-3 flex justify-end">
        <Button onClick={onEndTurn} variant="ghost">End Turn ↩︎</Button>
      </div>
    </Card>
  );
}
