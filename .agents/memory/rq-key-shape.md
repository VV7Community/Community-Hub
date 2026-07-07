---
name: React Query key shape for channel messages
description: The generated query key for useGetChannelMessages always requires a second params argument.
---

`getGetChannelMessagesQueryKey(channelId, {})` — always pass the second `{}` argument.
Calling it as `getGetChannelMessagesQueryKey(channelId)` (no second arg) produces a different array key, so WS cache updates miss the active query cache entry.

**Why:** Orval generates the key function to include all query-parameter arguments. Omitting optional params still changes the key shape.

**How to apply:** Wherever WS handlers call `setQueryData` for channel messages, and wherever `useGetChannelMessages` is invoked with a custom queryKey option, both must use `getGetChannelMessagesQueryKey(channelId, {})`.
