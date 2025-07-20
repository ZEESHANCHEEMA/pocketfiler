import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleNotificationClick } from "./notificationHandler"; // Handle navigation
import "./CallNotification.css"; // Import styles

import eventEmitter from "./eventEmitter";

// 🔹 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXbmX1vIIuxVVQ0PP0el5ahV3UOFJ0WuQ",
  authDomain: "pocketfiler-f52d8.firebaseapp.com",
  projectId: "pocketfiler-f52d8",
  storageBucket: "pocketfiler-f52d8.firebasestorage.app",
  messagingSenderId: "28463941306",
  appId: "1:28463941306:web:225b1f02095f14d2dd2483",
  measurementId: "G-5DKY5L2LW9",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Request Notification Permission
export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ Notification permission denied.");
      return null;
    }

    const supported = await isSupported();
    if (!supported) {
      return;
    }

    listenForMessages();

    console.log("✅ Notification permission granted.");

    let token = localStorage.getItem("fcm_token");
    if (token) {
      console.log("✅ Using cached FCM Token:", token);
      return token;
    }
    const messaging = getMessaging(app);
    token = await getToken(messaging, {
      vapidKey:
        "BOo9JbK6K5kqj7M58-LYzRSinpT1SfWFc9GK4nznQs27q5U95goAuuTjVgfrENFwN3GWoEBRq53VxZD0VDXuESA",
    });

    if (token) {
      console.log("✅ New FCM Token:", token);
      localStorage.setItem("fcm_token", token);
    } else {
      console.log("⚠️ No FCM token received.");
    }

    return token;
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return null;
  }
};

// 🔹 Handle Incoming Notifications
export const listenForMessages = () => {
  const messaging = getMessaging(app);
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground notification received:", payload);

    const { title, body } = payload.notification;
    const { action, call_type, callId, channel_name, channel_token, userId } =
      payload.data || {}; // Extract call data

    // If notification is a call
    const path = window.location.pathname;
    if (
      path.includes("Audio") === false &&
      path.includes("VideoCall") === false &&
      action === "call_notification"
    ) {
      showCallNotification(
        title,
        body,
        call_type,
        callId,
        channel_name,
        channel_token,
        userId
      );
    } else {
      // Handle other notifications
      toast.info(
        <>
          <strong>{title}</strong>
          <br />
          {body}
        </>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "custom-toast",
          onClick: () => handleNotificationClick(action),
        }
      );
    }
  });
};

// 🔹 Display Call Notification with Accept/Reject

const ringtone = new Audio("/audio/mi_pure.mp3"); // Replace with your file path
ringtone.loop = true; // Loop the ringtone
const showCallNotification = (
  title,
  body,
  call_type,
  callId,
  channel_name,
  channel_token,
  userId
) => {
  ringtone
    .play()
    .catch((error) => console.log("🔊 Ringtone play failed:", error));

  toast.info(
    <div className="call-notification">
      <div className="call-info">
        <div className="call-details">
          <strong>{title}</strong>
          <p>{body}</p>
          <span className="call-type">
            {call_type === "video_call" ? "📹 Video Call" : "🎙 Audio Call"}
          </span>
        </div>
      </div>

      <div className="call-actions">
        <button
          className="accept-btn"
          onClick={() => {
            ringtone.pause(); // Stop ringtone
            ringtone.currentTime = 0; // Reset audio
            eventEmitter.emit("navigateToScreen", {
              call_type,
              callId,
              channel_name,
              channel_token,
              userId,
            });

            toast.dismiss();
          }}
        >
          Accept
        </button>
        <button className="reject-btn" onClick={() => rejectCall(callId)}>
          Reject
        </button>
      </div>
    </div>,
    {
      position: "top-right",
      autoClose: 30000,
      closeOnClick: false,
      draggable: false,
      className: "call-toast",
      onClose: () => {
        ringtone.pause();
        ringtone.currentTime = 0;
      },
      style: {
        backgroundColor: "rgba(255,255,255,.9)",
      },
    }
  );
};

// 🔹 Reject Call
const rejectCall = (callId) => {
  console.log("❌ Call Rejected:", callId);
  ringtone.pause(); // Stop ringtone
  ringtone.currentTime = 0; // Reset audio
  toast.dismiss(); // Dismiss the call notification
};
