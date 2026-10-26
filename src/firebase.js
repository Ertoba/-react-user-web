import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArLid_ik38oXXqKRGG60HqO03zzLuMz4Y",
  authDomain: "portal-9524e.firebaseapp.com",
  projectId: "portal-9524e",
  storageBucket: "portal-9524e.firebasestorage.app",
  messagingSenderId: "100879464630",
  appId: "1:100879464630:web:4feeb9cd982d48242cce17",
};

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(firebaseApp);

// Correctly export a promise that resolves to messaging instance (or null)
export const getMessagingObject = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    console.error("Messaging not supported:", err);
    return null;
  }
};

// fetchToken function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    setTokenFound(false);
    return null;
  }
  try {
    const messaging = await getMessagingObject();
    if (!messaging) return;

    const currentToken = await getToken(messaging, {
      vapidKey:
        "BB04Vu4lvHc3ZvsXNOkt-iJWnyjwUztO_WDEHRB7GvqjVThv3hddJrI_vii510f1qk9NJVKb25NOVwrhjz6g3uM",
    });

    if (currentToken) {
      setTokenFound(true);
      setFcmToken(currentToken);
      return currentToken;
    } else {
      setTokenFound(false);
      setFcmToken('');
    }
  } catch (err) {
    console.error("Token fetch error:", err);
  }
};

// Register a long-lived foreground listener and return Firebase's unsubscribe.
 // A Promise that resolves on the first message cannot be safely recreated every
 // time a notification changes; that leaks multiple listeners and duplicates toasts.
export const subscribeToMessages = async (onPayload) => {
  const messaging = await getMessagingObject();
  if (!messaging) return () => {};
  return onMessage(messaging, onPayload);
};

// onMessageListener function
export const onMessageListener = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const messaging = await getMessagingObject();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });
