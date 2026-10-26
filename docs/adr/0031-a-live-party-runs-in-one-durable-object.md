---
status: accepted
---

# A live party runs in one Durable Object

A party needs every player's device to learn within a moment that someone
joined, marked ready or submitted, that the host changed a setting, and that a
reveal happened. Vercel functions answer one request and end, so the server
cannot send a change to a device on its own. Each party therefore gets one
Cloudflare Durable Object. It holds the party in memory, keeps a WebSocket open
to each device, applies every action to the party's state and sends the new
state to every device. Nothing writes the party to PostgreSQL, and the object
discards it two hours after the last action, which leaves the host time to
play again with the same players.

The rules of a party are one pure function from state and action to new state,
kept in this repo and covered by tests. The Durable Object only receives
actions, calls that function and sends the result. A device that reconnects
receives the whole state, so it needs no message it missed while offline.

The deciding limits were the free tiers, read on 2026-10-26, for a 10-player,
15-question, 10-minute party. The owner wants the design to hold at 100
parties a day and to scale by moving to a paid tier.

## Considered options

- Polling a Vercel route that reads the party from PostgreSQL, every 3 seconds
  in the lobby and every second during questions. About 5,000 requests a
  party, so about 15 million a month at 100 parties a day against Vercel
  Hobby's 1 million function invocations. Each action also writes to Neon,
  which keeps the database awake. Neon's free plan sleeps after 5 idle minutes
  and allows 100 compute-hours a month, and a database awake all day uses
  about 180. Neon then suspends the database for the whole site until the
  month ends.
- Pusher to send changes, with the party in PostgreSQL. Pusher's free plan
  allows 100 connected devices across all parties and 200,000 messages a day,
  counting each delivery to each device. 100 parties need about 230,000, and
  the party would still live in Neon with the cost above.
- The host's device as the server over WebRTC. No server cost, but the party
  ends when the host's phone locks or loses signal, and it still needs a
  server to connect the devices.

## Consequences

Cloudflare's free plan allows 100,000 requests a day. A WebSocket connection
counts as one request, 20 incoming messages count as one, and outgoing
messages are free, so a party costs about 50 and 100 parties about 5,000. The
Workers paid plan is $5 a month.

The repo gains a Worker deployed with `wrangler` beside the Next.js app on
Vercel, a Cloudflare account, and a second process to run in local
development. Namaq keeps no results, so there is no party history or all-time
leaderboard. Adding one later means choosing where results live.
