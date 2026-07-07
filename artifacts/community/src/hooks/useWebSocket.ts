import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetChannelMessagesQueryKey, getGetOnlineUsersQueryKey } from '@workspace/api-client-react';
import type { Message, OnlineUsersResponse } from '@workspace/api-client-react';

interface WsUser {
  userId: string;
  username: string;
  avatarUrl?: string | null;
}

export function useWebSocket(channelId?: string, user?: WsUser) {
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoff = useRef(1000);
  const isMounted = useRef(true);
  const channelIdRef = useRef(channelId);
  const userRef = useRef(user);

  // Keep refs in sync without re-running connect
  channelIdRef.current = channelId;
  userRef.current = user;

  const connect = useCallback(() => {
    if (!isMounted.current) return;
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted.current) { socket.close(); return; }
      backoff.current = 1000;

      // Send auth first so server registers the client for presence
      const u = userRef.current;
      if (u?.userId) {
        socket.send(JSON.stringify({
          type: 'auth',
          userId: u.userId,
          username: u.username,
          avatarUrl: u.avatarUrl ?? null,
        }));
      }

      // Then join the current channel
      const ch = channelIdRef.current;
      if (ch) {
        socket.send(JSON.stringify({ type: 'join', channelId: ch }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
          const msg = data.message as Message;
          // Match the exact key shape used by main-room: queryKey(channelId, {})
          queryClient.setQueryData<Message[]>(
            getGetChannelMessagesQueryKey(msg.channelId, {}),
            (old) => old ? [...old, msg] : [msg],
          );
        } else if (data.type === 'reaction') {
          const msg = data.message as Message;
          queryClient.setQueryData<Message[]>(
            getGetChannelMessagesQueryKey(msg.channelId, {}),
            (old) => old?.map((m) => (m.id === msg.id ? msg : m)) ?? [],
          );
        } else if (data.type === 'delete') {
          // Backend broadcasts { type:'delete', messageId, channelId }
          const { messageId, channelId: msgChannelId } = data;
          if (msgChannelId) {
            queryClient.setQueryData<Message[]>(
              getGetChannelMessagesQueryKey(msgChannelId, {}),
              (old) => old?.filter((m) => m.id !== messageId) ?? [],
            );
          }
        } else if (data.type === 'presence') {
          queryClient.setQueryData<OnlineUsersResponse>(
            getGetOnlineUsersQueryKey(),
            { count: data.count, users: data.users },
          );
        }
      } catch (err) {
        console.error('WS message parse error', err);
      }
    };

    socket.onclose = () => {
      if (!isMounted.current) return; // Don't reconnect after unmount
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = setTimeout(() => {
        backoff.current = Math.min(backoff.current * 1.5, 10000);
        connect();
      }, backoff.current);
    };

    socket.onerror = () => {
      socket.close();
    };
  }, []); // stable — uses refs for dynamic values

  useEffect(() => {
    isMounted.current = true;
    connect();
    return () => {
      isMounted.current = false;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
      ws.current = null;
    };
  }, [connect]);

  // When channelId changes, notify server via join
  useEffect(() => {
    if (ws.current?.readyState === WebSocket.OPEN && channelId) {
      ws.current.send(JSON.stringify({ type: 'join', channelId }));
    }
  }, [channelId]);

  // Re-send auth whenever user identity resolves/changes and socket is already open.
  // This covers the common case where the socket opens before useGetMe returns data.
  useEffect(() => {
    if (!user?.userId) return;
    if (ws.current?.readyState !== WebSocket.OPEN) return;
    ws.current.send(JSON.stringify({
      type: 'auth',
      userId: user.userId,
      username: user.username,
      avatarUrl: user.avatarUrl ?? null,
    }));
  }, [user?.userId, user?.username, user?.avatarUrl]);

  return ws.current;
}
