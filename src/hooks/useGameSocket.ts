// src/hooks/useGameSocket.ts
import { useEffect, useRef } from 'react';
import { wsUrl } from '../api';

/**
 * useGameSocket
 * Minimal WebSocket hook for game updates (TypeScript version).
 * @param gameId string
 * @param onMessage callback invoked with parsed JSON messages
 */
export function useGameSocket(gameId: string, onMessage?: (msg: unknown) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const url = wsUrl(`/ws/games/${gameId}`);
    let ws: WebSocket;

    function connect() {
      ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => { /* connected */ };
      ws.onmessage = (e: MessageEvent) => {
        try { const data = JSON.parse(e.data as string); onMessage?.(data); } catch { /* ignore */ }
      };
      ws.onclose = () => {
        timer.current = window.setTimeout(connect, 1000);
      };
      ws.onerror = () => { try { ws.close(); } catch { /* noop */ } };
    }

    connect();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      try { wsRef.current?.close(); } catch { /* noop */ }
    };
  }, [gameId, onMessage]);
}

export default useGameSocket;
