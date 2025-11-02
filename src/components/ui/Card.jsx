import React from 'react';


export function Card({ className = '', children, padded = true }) {
return (
<div className={`rounded-2xl border bg-white ${padded ? 'p-3' : ''} ${className}`}>{children}</div>
);
}


export function CardHeader({ title, hint, right }) {
return (
<div className="mb-2 flex items-center justify-between">
<div>
<div className="text-sm font-semibold">{title}</div>
{hint && <div className="text-xs text-neutral-500">{hint}</div>}
</div>
{right}
</div>
);
}


export function CardSection({ title, children }) {
return (
<div className="py-2">
{title && <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">{title}</div>}
{children}
</div>
);
}