import React from 'react';


export default function Select({ className = '', children, ...props }) {
return (
<select className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 ${className}`} {...props}>
{children}
</select>
);
}