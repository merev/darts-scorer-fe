// ---------- Types ----------
export type UUID = string;
export type GameFormat = 'X01' | 'CRICKET' | 'AROUND_THE_WORLD' | 'SHANGHAI';

export interface Player { id: UUID; nickname: string; }

export interface X01Variant { x01: number; double_out?: boolean; double_in?: boolean; }
export interface CricketVariant { cutthroat?: boolean; }
export type Variant = X01Variant | CricketVariant | Record<string, unknown>;

export interface GameState {
  currentPlayerId?: UUID;
  dartsLeftInTurn?: number;
  // X01
  scores?: Record<UUID, number>;
  lastTurns?: Record<UUID, string>;
  checkoutHint?: string | string[];
  // Cricket
  marks?: Record<UUID, Record<20|19|18|17|16|15|'BULL', number>>;
  points?: Record<UUID, number>;
  closed?: Partial<Record<20|19|18|17|16|15|'BULL', boolean>>;
  // Enhanced cricket context
  activeTarget?: 20|19|18|17|16|15|'BULL';
  turnMarks?: Record<UUID, Array<{ target: 20|19|18|17|16|15|'BULL', mult: 1|2|3 }>>;

  events?: string[];
  legNo?: number;
  turnNo?: number;
  winner?: { playerId: UUID; nickname: string } | null;
}

export interface Game {
  id: UUID;
  format: GameFormat;
  variant: Variant;
  players: Player[];
  state: GameState;
}

export interface LeaderboardItem { playerId: UUID; nickname: string; value: number; }

export class ApiError extends Error {
  status?: number;
  body?: any;
  constructor(message: string, { status, body }: { status?: number; body?: any } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ---------- Utils ----------
const ENV_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || '/api';

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

function safeJson(text: string) {
  try { return JSON.parse(text); } catch { return null; }
}

// Normalize any list-ish response into an array
function arrayify<T>(v: unknown, field?: string): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v && field && Array.isArray((v as any)[field])) return (v as any)[field] as T[];
  return [];
}

// ---------- Core fetch ----------
async function request<T = any>(path: string, opts: RequestInit & { json?: any } = {}): Promise<T> {
  const url = path.startsWith('http') ? path : joinUrl(ENV_BASE, path);

  const { json, headers, ...rest } = opts;
  const init: RequestInit = {
    ...rest,
    headers: {
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body: json !== undefined ? JSON.stringify(json) : (rest as any).body,
  };

  const res = await fetch(url, init);

  // Gracefully handle 204/empty
  if (res.status === 204) {
    // @ts-expect-error allow void returns
    return undefined as T;
  }

  const text = await res.text();
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') && text ? safeJson(text) : (text as any);

  if (!res.ok) {
    throw new ApiError((data?.message || text || `HTTP ${res.status}`) as string, {
      status: res.status,
      body: data
    });
  }

  return data as T;
}

// ---------- Endpoints ----------
export const api = {
  // games
  getGame: (id: UUID) => request<Game>(`/games/${id}`),
  createGame: (payload: any) => request<{ id: UUID }>(`/games`, { method: 'POST', json: payload }),
  throw: (id: UUID, dart: { segment: number | 25 | 50 | 0; mult: 1 | 2 | 3 }) =>
    request<void>(`/games/${id}/throw`, { method: 'POST', json: dart }),
  undo: (id: UUID) => request<void>(`/games/${id}/undo`, { method: 'POST' }),

  // players  (normalize so UI never crashes on `.map`)
  listPlayers: async () => {
    const raw = await request<any>(`/players`);
    return arrayify<Player>(raw, 'players');
  },
  createPlayer: (nickname: string) => request<Player>(`/players`, { method: 'POST', json: { nickname } }),
  deletePlayer: (id: UUID) => request<void>(`/players/${id}`, { method: 'DELETE' }),

  // stats
  leaderboards: async (metric: string) => {
    const raw = await request<any>(`/stats/leaderboards?metric=${encodeURIComponent(metric)}`);
    return arrayify<LeaderboardItem>(raw, 'items');
  },
};

// ---------- WebSocket URL helper (respects ENV_BASE) ----------
export function wsUrl(path: string) {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const apiBase = ENV_BASE;

  if (apiBase.startsWith('/')) {
    // same-origin, keep the /api prefix
    return `${proto}://${location.host}${joinUrl(apiBase, path)}`;
  }
  // absolute base like http://raccoon-api-stg:8000
  const host = apiBase.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const basePath = apiBase.replace(/^https?:\/\/[^/]+/, ''); // "/api" or ""
  return `${proto}://${host}${joinUrl(basePath || '/', path)}`;
}

export default api;
