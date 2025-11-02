// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-2 text-neutral-700">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
