import { useEffect } from "react";

/**
 * Accessibility Enhancements Component
 * Applies WCAG 2.1 AA standards and accessibility best practices
 */
export function useAccessibilityEnhancements() {
  useEffect(() => {
    // Skip to main content link
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.textContent = "Skip to main content";
    skipLink.className = "sr-only focus:not-sr-only fixed top-0 left-0 z-50 bg-blue-600 text-white px-4 py-2";
    document.body.prepend(skipLink);

    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll("button, a, input, select, textarea");
    interactiveElements.forEach((element) => {
      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "0");
      }
    });

    // Add focus visible styles
    const style = document.createElement("style");
    style.textContent = `
      :focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      
      .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: inherit;
        margin: inherit;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }
      
      /* Ensure sufficient color contrast */
      body {
        color: #1e293b;
      }
      
      a {
        color: #2563eb;
        text-decoration: underline;
      }
      
      a:visited {
        color: #7c3aed;
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Announce page changes for screen readers
    const announcer = document.createElement("div");
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.id = "announcer";
    document.body.appendChild(announcer);

    return () => {
      skipLink.remove();
      style.remove();
      announcer.remove();
    };
  }, []);
}

/**
 * Announce a message to screen readers
 */
export function announceToScreenReader(message: string) {
  const announcer = document.getElementById("announcer");
  if (announcer) {
    announcer.textContent = message;
  }
}

/**
 * Accessibility attributes helper
 */
export const a11y = {
  // Label for screen readers
  label: (text: string) => ({
    "aria-label": text,
  }),

  // Describe element
  description: (text: string) => ({
    "aria-describedby": `desc-${Math.random().toString(36).substr(2, 9)}`,
  }),

  // Loading state
  loading: (isLoading: boolean) => ({
    "aria-busy": isLoading,
  }),

  // Button states
  button: {
    disabled: (isDisabled: boolean) => ({
      disabled: isDisabled,
      "aria-disabled": isDisabled,
    }),
    pressed: (isPressed: boolean) => ({
      "aria-pressed": isPressed,
    }),
  },

  // Form
  form: {
    required: () => ({
      required: true,
      "aria-required": true,
    }),
    invalid: (isInvalid: boolean) => ({
      "aria-invalid": isInvalid,
    }),
  },

  // Navigation
  nav: {
    current: () => ({
      "aria-current": "page",
    }),
  },
};
