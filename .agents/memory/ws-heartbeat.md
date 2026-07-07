---
name: WS heartbeat pattern
description: Correct pattern for ws keepalive using ping/pong in the node `ws` library.
---

Set `(ws as any)._isAlive = true` immediately on `connection` AND inside the `pong` handler.
The heartbeat interval only sets it to `false` and pings — it never sets it true.
Without initialising on connect, the first 30s heartbeat terminates every socket before any pong arrives.

**Why:** The `ws` library does not initialise custom properties. The only code that sets `_isAlive = true` must be (a) on new connection and (b) in the pong handler.

**How to apply:** Any time you add or modify WS keepalive in this project, follow this three-location pattern: init on connect, reset in pong, check+clear in interval.
