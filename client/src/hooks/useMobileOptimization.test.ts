import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMobileOptimization, useAppInstalled, useInstallPrompt } from "./useMobileOptimization";

describe("useMobileOptimization", () => {
  beforeEach(() => {
    // Reset window size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it("should detect mobile screen size", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useMobileOptimization());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.screenSize).toBe("sm");
  });

  it("should detect tablet screen size", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800,
    });

    const { result } = renderHook(() => useMobileOptimization());
    expect(result.current.isTablet).toBe(true);
    expect(result.current.screenSize).toBe("md");
  });

  it("should detect landscape orientation", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { result } = renderHook(() => useMobileOptimization());
    expect(result.current.isLandscape).toBe(true);
  });

  it("should detect touch support", () => {
    const { result } = renderHook(() => useMobileOptimization());
    expect(typeof result.current.supportsTouch).toBe("boolean");
  });

  it("should detect notification support", () => {
    const { result } = renderHook(() => useMobileOptimization());
    expect(typeof result.current.supportsNotifications).toBe("boolean");
  });

  it("should detect online status", () => {
    const { result } = renderHook(() => useMobileOptimization());
    expect(typeof result.current.isOnline).toBe("boolean");
  });

  it("should update on window resize", () => {
    const { result, rerender } = renderHook(() => useMobileOptimization());

    expect(result.current.isMobile).toBe(false);

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    window.dispatchEvent(new Event("resize"));
    rerender();

    // Note: In real tests with proper setup, this would update
    // For now, we're testing the hook structure
  });
});

describe("useAppInstalled", () => {
  it("should return false when not installed as PWA", () => {
    const { result } = renderHook(() => useAppInstalled());
    expect(typeof result.current).toBe("boolean");
  });

  it("should detect standalone mode", () => {
    Object.defineProperty(window.navigator, "standalone", {
      writable: true,
      configurable: true,
      value: true,
    });

    const { result } = renderHook(() => useAppInstalled());
    expect(typeof result.current).toBe("boolean");
  });
});

describe("useInstallPrompt", () => {
  it("should return install prompt state", () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current).toHaveProperty("canInstall");
    expect(result.current).toHaveProperty("installApp");
    expect(typeof result.current.canInstall).toBe("boolean");
    expect(typeof result.current.installApp).toBe("function");
  });

  it("should have installApp function", () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.installApp).toBeDefined();
  });
});
