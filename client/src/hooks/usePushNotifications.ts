import { useEffect, useState } from "react";

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: Record<string, any>;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if push notifications are supported
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      setRegistration(reg);
      console.log("[Push Notifications] Service Worker registered");

      // Check if already subscribed
      const subscription = await reg.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("[Push Notifications] Service Worker registration failed:", error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn("[Push Notifications] Push notifications not supported");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("[Push Notifications] Permission request failed:", error);
      return false;
    }
  };

  const subscribe = async (vapidPublicKey?: string) => {
    if (!registration) {
      console.warn("[Push Notifications] Service Worker not registered");
      return false;
    }

    try {
      const permission = await requestPermission();
      if (!permission) {
        console.warn("[Push Notifications] Permission denied");
        return false;
      }

      const subscriptionOptions: PushSubscriptionOptionsInit = {
        userVisibleOnly: true,
      };

      if (vapidPublicKey) {
        subscriptionOptions.applicationServerKey = urlBase64ToUint8Array(vapidPublicKey) as any;
      }

      const subscription = await registration.pushManager.subscribe(subscriptionOptions);
      setIsSubscribed(true);
      console.log("[Push Notifications] Subscribed successfully");

      // Send subscription to server
      await fetch("/api/trpc/notifications.subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });

      return true;
    } catch (error) {
      console.error("[Push Notifications] Subscription failed:", error);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!registration) {
      console.warn("[Push Notifications] Service Worker not registered");
      return false;
    }

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        console.log("[Push Notifications] Unsubscribed successfully");

        // Notify server
        await fetch("/api/trpc/notifications.unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });

        return true;
      }
    } catch (error) {
      console.error("[Push Notifications] Unsubscription failed:", error);
    }

    return false;
  };

  const showNotification = async (options: PushNotificationOptions) => {
    if (!registration) {
      console.warn("[Push Notifications] Service Worker not registered");
      return;
    }

    try {
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || "/icon-192x192.png",
        badge: options.badge || "/badge-72x72.png",
        tag: options.tag || "learncode-notification",
        requireInteraction: options.requireInteraction || false,
        data: options.data || {},
      });
    } catch (error) {
      console.error("[Push Notifications] Show notification failed:", error);
    }
  };

  const enableBackgroundSync = async () => {
    if (!registration) {
      console.warn("[Push Notifications] Service Worker not registered");
      return false;
    }

    try {
      if ("sync" in registration) {
        await (registration.sync as any).register("sync-messages");
        console.log("[Push Notifications] Background sync enabled");
        return true;
      }
    } catch (error) {
      console.error("[Push Notifications] Background sync registration failed:", error);
    }

    return false;
  };

  const enablePeriodicSync = async (tag: string, minInterval: number = 24 * 60 * 60 * 1000) => {
    if (!registration) {
      console.warn("[Push Notifications] Service Worker not registered");
      return false;
    }

    try {
      if ("periodicSync" in registration) {
        await (registration.periodicSync as any).register(tag, { minInterval });
        console.log("[Push Notifications] Periodic sync enabled for:", tag);
        return true;
      }
    } catch (error) {
      console.error("[Push Notifications] Periodic sync registration failed:", error);
    }

    return false;
  };

  return {
    isSupported,
    isSubscribed,
    registration,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    enableBackgroundSync,
    enablePeriodicSync,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray as Uint8Array;
}
