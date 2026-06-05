# FixPair Video Session Integration Guideline (Web Admin Dashboard)

This document provides a comprehensive guide for the Admin Dashboard and Consultant Web Platform to integrate and manage real-time video sessions using Agora RTC and the FixPair Backend API.

---

## 1. Overview
### Purpose
The Video Session module facilitates real-time, peer-to-peer communication between Consultants and Users. It is the core value proposition of the FixPair platform, integrating scheduling, real-time signaling, automated per-minute billing, and final invoice generation.

### Connectivity
- **Consultation Flow**: A video session can only be created for an **Accepted/Confirmed** consultation.
- **Billing Engine**: The session state (ongoing/ended) directly controls the automated billing cycle.
- **Notifications**: Signaling (incoming calls) is handled via Socket.io for Web and FCM for Mobile.

---

## 2. Video Session Flow
1. **Consultation Request**: User creates a request.
2. **Acceptance**: Consultant accepts the request (Status: `pending` -> `confirmed`).
3. **Session Creation**: Either party initiates the call, creating a `VideoSession` record (Status: `pending`).
4. **Signaling**: Backend sends an `incoming-call` event to the recipient.
5. **Joining**: Both users join the channel. **The first user joining triggers the billing engine.**
6. **Live Session**: Agora RTC handles the media stream. Backend tracks duration.
7. **End Session**: Either user clicks "End Call".
8. **Finalization**: Backend stops billing, generates a PDF invoice, and marks consultation as `completed`.

---

## 3. Required APIs

### A. Session Management
| Action | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Create Session** | `/api/v1/video-session/create` | `POST` | Creates a new session for a `consultationId`. Returns `appId`, `token`, and `channelName`. |
| **Join Session** | `/api/v1/video-session/join` | `POST` | **Crucial**: Starts the billing timer. Call this right before `client.join()`. |
| **End Session** | `/api/v1/video-session/end` | `POST` | Stops billing and triggers invoice generation. |
| **Get My Sessions** | `/api/v1/video-session` | `GET` | List all sessions for the logged-in user/consultant. |

### B. Supporting APIs
| Action | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Get Invoice** | `/api/v1/payment/invoice/:consultationId` | `GET` | Retrieve the generated billing data after a session ends. |
| **Call Action** | `/api/v1/video-session/action` | `POST` | Handle `REJECT` or `CANCEL` actions for incoming calls. |

---

## 4. Frontend Integration Details

### Local State Storage
After calling the **Create** or **Join** API, the frontend must store the following in its state/context:
- `sessionId`: The unique ID of the video session record.
- `consultationId`: The related booking ID.
- `appId`: The Agora App ID (provided by backend).
- `token`: The temporary security token for the channel.
- `channelName`: The unique channel string (e.g., `consultation_65f...`).
- `uid`: The numeric UID assigned by backend (`1001` for User, `2001` for Consultant).

### Handling UI States
- **Loading**: Show a "Connecting..." overlay while calling Join API and initializing Agora.
- **Success**: Display the local video stream and start a local timer for visual feedback.
- **Error**: Handle "Permission Denied" (mic/cam), "Network Error", or "Insufficient Funds" (from Join API).

---

## 5. Agora RTC Integration (Code Snippets)

### Initialization
```javascript
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = { videoTrack: null, audioTrack: null };

async function initializeCall(data) {
  const { appId, channelName, token, uid } = data;

  // 1. Join Channel
  await client.join(appId, channelName, token, uid);

  // 2. Create Tracks
  [localTracks.audioTrack, localTracks.videoTrack] = 
    await AgoraRTC.createMicrophoneAndCameraTracks();

  // 3. Publish
  await client.publish(Object.values(localTracks));
  
  // 4. Play Local
  localTracks.videoTrack.play("local-video-container");
}
```

### Remote User Handling
```javascript
client.on("user-published", async (user, mediaType) => {
  await client.subscribe(user, mediaType);
  if (mediaType === "video") {
    user.videoTrack.play("remote-video-container");
  }
  if (mediaType === "audio") {
    user.audioTrack.play();
  }
});
```

---

## 6. Admin Dashboard Features
The Admin Dashboard should provide a high-level view of all real-time activity:
1. **Live Monitor**: List all sessions with status `ongoing`.
2. **Participant Tracking**: Show User vs. Consultant details for every active call.
3. **Billing Status**: Display `consumedAmount` in real-time (updated via Socket.io).
4. **Manual Override**: Admins should have an "End Session" button to force-stop a call if a dispute occurs or a user is stuck.
5. **Invoice View**: Access the PDF URL generated at the end of each session.

---

## 7. Status Management Reference

| Status | Meaning | Frontend Behavior |
| :--- | :--- | :--- |
| `pending` | Session created, recipient notified. | Show "Calling..." screen. |
| `ongoing` | At least one user joined, billing active. | Show Video UI and active timer. |
| `ended` | Session closed by user or system. | Show "Call Summary" or redirect to Review. |
| `cancelled` | Caller hung up before answer. | Close call overlay. |
| `failed` | Payment failed or system error. | Show "Insufficient Balance" or "Connection Error". |

---

## 8. Error Handling Checklist
- **Missing AppID**: Backend configuration error. Check `.env`.
- **User Failed to Publish**: Check browser permissions (Camera/Mic).
- **Remote User Not Joining**: Recipient may have rejected the call or is offline.
- **Session Already Ended**: User trying to join a completed consultation.
- **Network Disconnect**: Implement `client.on("connection-state-change")` to handle re-joining.

---

## 9. Testing Checklist
- [ ] User A joins, User B joins -> Both see each other.
- [ ] Muting/Unmuting works for both audio and video.
- [ ] Refreshing the browser allows re-joining the same session.
- [ ] Clicking "End Call" redirects both users and stops the billing.
- [ ] Admin Dashboard shows the session duration correctly after it ends.
- [ ] Invoice is generated and downloadable via the `pdfUrl` provided in response.

---
**Document Version**: 1.1  
**Last Updated**: 2026-06-05  
**Backend Support**: FixPair Dev Team
