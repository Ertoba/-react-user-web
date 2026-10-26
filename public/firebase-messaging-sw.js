importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// // Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyArLid_ik38oXXqKRGG60HqO03zzLuMz4Y",
  authDomain: "portal-9524e.firebaseapp.com",
  projectId: "portal-9524e",
  storageBucket: "portal-9524e.firebasestorage.app",
  messagingSenderId: "100879464630",
  appId: "1:100879464630:web:4feeb9cd982d48242cce17",
  measurementId: "",
};

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase?.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
