import { useEffect, useState } from "react";

interface MobileOptimization {
  isMobile: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  screenSize: "sm" | "md" | "lg" | "xl";
  supportsTouch: boolean;
  supportsNotifications: boolean;
  isOnline: boolean;
}

export function useMobileOptimization(): MobileOptimization {
  const [optimization, setOptimization] = useState<MobileOptimization>({
    isMobile: false,
    isTablet: false,
    isLandscape: false,
    screenSize: "lg",
    supportsTouch: false,
    supportsNotifications: false,
    isOnline: true,
  });

  useEffect(() => {
    const updateOptimization = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;

      let screenSize: "sm" | "md" | "lg" | "xl" = "lg";
      if (width < 640) screenSize = "sm";
      else if (width < 1024) screenSize = "md";
      else if (width < 1280) screenSize = "lg";
      else screenSize = "xl";

      const supportsTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      setOptimization({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isLandscape,
        screenSize,
        supportsTouch,
        supportsNotifications: "Notification" in window,
        isOnline: navigator.onLine,
      });
    };

    updateOptimization();

    window.addEventListener("resize", updateOptimization);
    window.addEventListener("orientationchange", updateOptimization);
    window.addEventListener("online", updateOptimization);
    window.addEventListener("offline", updateOptimization);

    return () => {
      window.removeEventListener("resize", updateOptimization);
      window.removeEventListener("orientationchange", updateOptimization);
      window.removeEventListener("online", updateOptimization);
      window.removeEventListener("offline", updateOptimization);
    };
  }, []);

  return optimization;
}

/**
 * Request permission for push notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Send a local notification
 */
export async function sendLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!("Notification" in window)) {
    console.log("Notifications not supported");
    return;
  }

  if (Notification.permission === "granted") {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      ...options,
    });
  }
}

/**
 * Check if app is installed (PWA)
 */
export function useAppInstalled(): boolean {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      // Check if running as PWA
      const isStandalone =
        (window.navigator as any).standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches;

      setIsInstalled(isStandalone);
    };

    checkInstalled();

    const handleInstallPrompt = () => {
      setIsInstalled(false);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  return isInstalled;
}

/**
 * Request app installation prompt
 */
export function useInstallPrompt(): { canInstall: boolean; installApp: () => void } {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      const prompt = deferredPrompt as any;
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  return { canInstall, installApp };
}
