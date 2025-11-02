export function toArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  // common cases: object with 'items' or comma-separated string
  if (Array.isArray((v as any).items)) return (v as any).items;
  if (typeof v === 'string') return v.length ? v.split(',') as any : [];
  return [];
}
