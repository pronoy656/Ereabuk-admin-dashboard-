# Web Integration Guide for Video Sessions (Agora)

This guide provides instructions for web developers to integrate video consultation functionality into the Consultant Dashboard using the Agora SDK and our backend API.

## Overview

The video session flow is managed by the backend and uses **Agora RTC** for real-time communication. The backend handles session state, Agora token generation, and automated billing.

### Session Lifecycle

1. **Initiation**: Either the consultant or user initiates the session based on an accepted consultation.
2. **Joining**: Both parties join the session. **Joining triggers the billing timer.**
3. **Ongoing**: Live video/audio communication.
4. **Termination**: Either party ends the session. **Ending stops the billing timer and generates an invoice.**

---

## 1. Setup

### Agora SDK

Add the Agora Web SDK to your project:

```bash
npm install agora-rtc-sdk-ng
```

### Required Configuration

You will need the **Agora App ID**, which can be retrieved from the backend team or configuration.

---

## 2. API Integration

### Step 1: Create a Video Session

Before joining, a session must be created for a specific consultation.

**Endpoint**: `POST /api/v1/video-session`  
**Headers**: `Authorization: Bearer <token>`  
**Body**:

```json
{
  "consultationId": "65f..."
}
```

**Response**: Returns a `sessionId`, `channelName`, and `token`.

---

### Step 2: Join the Session

This step is critical as it **starts the billing**. Only call this when the user is actually ready to enter the call.

**Endpoint**: `POST /api/v1/video-session/join`  
**Body**:

```json
{
  "sessionId": "65f..."
}
```

**Response**: Returns the session details including the `token` and `channelName`.

---

### Step 3: Agora RTC Implementation (Web)

Use the `token` and `channelName` received from the backend to join the Agora channel.

```javascript
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

async function startCall(appId, channel, token, uid) {
  // 1. Join the channel
  await client.join(appId, channel, token, uid);

  // 2. Create and publish local tracks (audio & video)
  const [audioTrack, videoTrack] =
    await AgoraRTC.createMicrophoneAndCameraTracks();
  await client.publish([audioTrack, videoTrack]);

  // 3. Play local video in a div container
  videoTrack.play("local-player");

  // 4. Handle remote users
  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      user.videoTrack.play("remote-player");
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  });
}
```

---

### Step 4: End the Session

When the consultant or user clicks "End Call", you must notify the backend to **stop billing**.

**Endpoint**: `POST /api/v1/video-session/end`  
**Body**:

```json
{
  "sessionId": "65f..."
}
```

---

## 3. Consultant Dashboard Features

### Active Session Monitoring

Consultants can see their history and pending sessions using:
**Endpoint**: `GET /api/v1/video-session`

### Important Rules

1. **Billing Trigger**: Billing starts only when the status changes to `ongoing` via the `/join` endpoint.
2. **Auto-Termination**: If the user's balance runs out, the backend will trigger an auto-end. The web app should listen for a socket event `consultation-auto-ended` to gracefully close the UI.
3. **Rejoining**: If a user disconnects accidentally, they can rejoin using the same `sessionId` as long as the session hasn't been explicitly "ended".

---

## 4. Socket Events (Optional but Recommended)

To provide a real-time experience, the consultant dashboard should listen for:

- `consultation-auto-ended`: Received when the session is terminated by the system (e.g., payment failure).
- `user-joined`: Can be used to show a notification when the client enters the room.

---

## 5. Security Notes

- **Tokens**: Agora tokens are short-lived. If a session lasts very long, the app might need to refresh the token (though the backend default is usually sufficient for standard consultations).
- **Permissions**: Ensure the browser has granted camera and microphone permissions before calling the `/join` endpoint.
