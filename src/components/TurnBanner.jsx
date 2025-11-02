import React from "react";

export function TurnBanner({ currentPlayerName, checkoutHint }) {
    return (
        <div className="mb-3 flex items-center justify-between rounded-2xl border px-3 py-2">
            <div className="text-sm">
                <span className="text-neutral-600">Current:</span>{" "}
                <span className="font-semibold">{currentPlayerName ?? "—"}</span>
            </div>
            {checkoutHint && (
                <div className="text-sm text-neutral-700">
                    <span className="font-medium">Checkout:</span> {checkoutHint}
                </div>
            )}
        </div>
    );
}