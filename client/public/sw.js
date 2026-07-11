// Service Worker for Push Notifications

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push notification received");

  let notificationData = {
    title: "LearnCode Notification",
    body: "You have a new message",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: "learncode-notification",
    requireInteraction: false,
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, notificationData));
});

self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked");
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab with the target URL
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener("notificationclose", (event) => {
  console.log("[Service Worker] Notification closed");
});

// Handle background sync for offline messages
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background sync triggered");

  if (event.tag === "sync-messages") {
    event.waitUntil(
      fetch("/api/trpc/messaging.syncOfflineMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("[Service Worker] Messages synced:", data);
        })
        .catch((error) => {
          console.error("[Service Worker] Sync failed:", error);
        })
    );
  }
});

// Periodic background sync for notifications
self.addEventListener("periodicsync", (event) => {
  console.log("[Service Worker] Periodic sync triggered");

  if (event.tag === "check-notifications") {
    event.waitUntil(
      fetch("/api/trpc/notifications.getUnread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("[Service Worker] Unread notifications:", data);
          // Show notification if there are unread items
          if (data.unreadCount > 0) {
            self.registration.showNotification("LearnCode", {
              body: `You have ${data.unreadCount} new notifications`,
              icon: "/icon-192x192.png",
              badge: "/badge-72x72.png",
              tag: "unread-notifications",
            });
          }
        })
        .catch((error) => {
          console.error("[Service Worker] Periodic sync failed:", error);
        })
    );
  }
});
