# Web Dashboard — Live Transcript Integration Guide

Audience: web/dashboard frontend developers (consultant-facing dashboard).
Companion to [AGORA_STT_INTEGRATION.md](AGORA_STT_INTEGRATION.md) — read that
first for the full UID mapping and socket payload reference.

---

## 0. How it works (read this first)

The backend starts an Agora STT bot (UID `9001`) when a session goes
`ongoing`. That bot **publishes recognized text as RTC data-stream messages
inside the channel** — Agora does not call the backend over HTTP. Only
clients joined to the channel can receive those messages.

So the flow for live captions is:

```
 STT bot (uid 9001)
       │  publishes data-stream message (recognized text)
       ▼
 Your dashboard (joined to the RTC channel)
       │  decodes the message
       │  POST /transcription/:consultationId/ingest  ──────┐
       ▼                                                     │
 Backend                                                     │
   - validates you're a participant of the session          │
   - persists finalized chunks to transcript history        │
   - re-broadcasts via Socket.IO `transcript:new`  ◄────────┘
       │
       ▼
 Both participants' dashboards/apps render the live caption
```

In short: **your dashboard is both a producer (relays what it decodes from
the RTC data stream) and a consumer (renders captions pushed back over
Socket.IO)**. This dual role is intentional — it lets the backend persist
history and fan the captions out to clients that aren't in the RTC channel
(e.g. an admin monitoring view).

---

## 1. Prerequisites

```bash
npm install agora-rtc-sdk-ng socket.io-client
```

You'll need, per session:
- `appId`, `channelName`, `token`, `uid` — returned by
  `POST /api/v1/video-session/join` (or pushed to you via the `incoming-call`
  socket event when the other party starts the call).
- Your auth JWT — used both for REST calls and the Socket.IO handshake.

---

## 2. Join the RTC channel

```ts
import AgoraRTC from 'agora-rtc-sdk-ng';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

await client.join(appId, channelName, token, uid);
// ... publish your own mic/camera tracks as usual for the call
```

---

## 3. Subscribe to the STT bot's data stream and relay chunks

The Web SDK emits `stream-message` for any data-stream messages published in
the channel — including the ones from the STT bot (`uid === 9001`). Decode
them and POST each chunk to the backend's `/ingest` endpoint.

> **Confirm the exact byte layout with Agora's current Real-Time
> Transcription docs** for your project/region — the snippet below assumes a
> JSON-encoded UTF-8 payload, which is the common case, but some STT product
> versions use a binary/protobuf envelope that needs a dedicated decoder.

```ts
import axios from 'axios';

const textDecoder = new TextDecoder('utf-8');

client.on('stream-message', async (uid, payload) => {
  // Only the STT bot publishes recognition results
  if (uid !== 9001) return;

  let result: { uid: number; text: string; isFinal: boolean; timestamp: number };
  try {
    result = JSON.parse(textDecoder.decode(payload));
  } catch {
    return; // not a recognition message we understand — ignore
  }

  // Forward to the backend so it can persist + fan out via Socket.IO
  try {
    await axios.post(
      `/api/v1/transcription/${consultationId}/ingest`,
      {
        uid: result.uid,        // 1001 (client) or 2001 (consultant)
        text: result.text,
        isFinal: result.isFinal,
        timestamp: result.timestamp,
      },
      { headers: { Authorization: `Bearer ${authToken}` } },
    );
  } catch (err) {
    console.error('Failed to relay transcript chunk', err);
    // Non-fatal — don't interrupt the call over a caption hiccup
  }
});
```

Notes:
- `uid` in the relayed body must be `1001` or `2001` — the backend rejects
  anything else (it identifies the *speaker*, not the relaying client).
- Send both interim (`isFinal: false`) and final chunks for smooth live
  captions; only final chunks are written to transcript history (the backend
  de-duplicates, since both participants relay the same bot message).
- This call is fire-and-forget from the UI's perspective — don't block
  rendering on it. Render your own optimistic caption immediately from the
  decoded `result`, and let the `transcript:new` socket event (below)
  reconcile/sync the canonical copy across both participants.

---

## 4. Connect Socket.IO and render live captions

```ts
import { io } from 'socket.io-client';

const socket = io(SOCKET_BASE_URL, {
  auth: { token: authToken }, // same JWT used for REST calls
});

socket.on('transcript:new', (payload) => {
  // payload: { consultationId, speakerUid, speakerRole, text, isFinal, timestamp }
  if (payload.consultationId !== consultationId) return;

  upsertCaptionLine({
    speaker: payload.speakerRole,    // 'user' | 'consultant'
    text: payload.text,
    isFinal: payload.isFinal,
    timestamp: payload.timestamp,
  });
});
```

Rendering tips:
- Key your caption lines by `(speakerUid, timestamp)` so an interim chunk
  (`isFinal: false`) can be replaced in place when its final version arrives,
  rather than appending a duplicate line.
- `speakerRole === 'consultant'` is **you** on the dashboard; show the other
  party's lines (`'user'`) distinctly (e.g. left/right alignment or color).

---

## 5. Load transcript history (e.g. on panel open / call end)

```ts
const { data } = await axios.get(
  `/api/v1/transcription/${consultationId}/history`,
  { headers: { Authorization: `Bearer ${authToken}` } },
);

// data: ITranscript[] sorted by `timestamp` ascending
renderTranscriptPanel(data);
```

Use this to populate the "Transcript History" side panel when the dashboard
loads mid-call, or to show a full reviewable transcript after the session
ends.

---

## 6. Cleanup

```ts
client.off('stream-message', handler);
await client.leave();
socket.off('transcript:new');
```

The backend automatically stops the STT bot when the session ends
(`POST /video-session/end`) — you don't need to call
`/transcription/:consultationId/stop` yourself unless you're building a
manual "mute captions" control.

---

## Quick reference

| Item | Value |
| :--- | :--- |
| Client UID | `1001` |
| Consultant UID | `2001` |
| STT bot UID | `9001` (never appears as a "speaker") |
| Relay chunk | `POST /api/v1/transcription/:consultationId/ingest` |
| Live caption event | Socket.IO `transcript:new` |
| History | `GET /api/v1/transcription/:consultationId/history` |
