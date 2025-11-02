import React, { useEffect } from "react";

export default function Toast({ kind = "info", text, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const style =
    kind === "error"
      ? "border-red-300 bg-red-50 text-red-800"
      : kind === "success"
      ? "border-green-300 bg-green-50 text-green-800"
      : "border-neutral-300 bg-white text-neutral-900";

  return (
    <div className={`pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow ${style}`}>
      {text}
    </div>
  );
}
