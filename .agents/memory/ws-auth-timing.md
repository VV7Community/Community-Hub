---
name: WS auth timing
description: How to handle async user identity when registering a WS client.
---

`useGetMe` is async — by the time `socket.onopen` fires the `me` query result is often still undefined.
Auth registration must happen in TWO places in the hook:
1. Inside `socket.onopen` — for when me resolves before the socket opens (reconnects after data loaded).
2. Inside a `useEffect` on `[user?.userId, user?.username, user?.avatarUrl]` — for when me resolves after the socket is already open (initial load race).

**Why:** If only sent in onopen, a fresh page load always misses registration because the REST call for /users/me takes longer than the WS handshake. Presence tracking silently fails until the next reconnect.

**How to apply:** Check both onopen and a dedicated user-change effect any time a WS hook needs to register identity.
