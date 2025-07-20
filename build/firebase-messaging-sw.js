// Import Firebase scripts (USE COMPAT VERSION FOR SERVICE WORKERS)
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXbmX1vIIuxVVQ0PP0el5ahV3UOFJ0WuQ",
  authDomain: "pocketfiler-f52d8.firebaseapp.com",
  projectId: "pocketfiler-f52d8",
  storageBucket: "pocketfiler-f52d8.firebasestorage.app",
  messagingSenderId: "28463941306",
  appId: "1:28463941306:web:225b1f02095f14d2dd2483",
  measurementId: "G-5DKY5L2LW9",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/logo192.png", // Change this to your app's icon
  });
});
