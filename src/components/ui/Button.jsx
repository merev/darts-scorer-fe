import React from 'react';


export default function Button({ as: As = 'button', variant = 'default', size = 'md', className = '', ...props }) {
const base = 'inline-flex items-center justify-center rounded-2xl border font-medium transition-colors';
const sizes = {
sm: 'text-sm px-3 py-1.5',
md: 'text-sm px-4 py-2',
lg: 'text-base px-5 py-2.5',
};
const variants = {
default: 'border-black hover:shadow',
ghost: 'border-transparent hover:border-neutral-300',
subtle: 'border-neutral-300 hover:shadow',
danger: 'border-red-500 text-red-600 hover:shadow',
};
const cls = `${base} ${sizes[size]} ${variants[variant] || variants.default} ${className}`;
return <As className={cls} {...props} />;
}