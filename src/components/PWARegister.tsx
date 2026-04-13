"use client";

import { useEffect, useState, useCallback } from "react";

export default function PWARegister() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );

  const handleUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setShowUpdate(false);
    window.location.reload();
  }, [waitingWorker]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV === "development"
    ) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Check for updates on registration
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // A new version is available
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          });
        });

        // Handle controller change (when skipWaiting is called)
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    };

    registerSW();
  }, []);

  if (!showUpdate) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#0f766e",
        color: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        fontSize: "0.875rem",
        fontWeight: 500,
        maxWidth: "calc(100vw - 2rem)",
      }}
    >
      <span>New version available</span>
      <button
        onClick={handleUpdate}
        aria-label="Refresh to update the app"
        style={{
          padding: "0.375rem 0.75rem",
          backgroundColor: "white",
          color: "#0f766e",
          border: "none",
          borderRadius: "0.375rem",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Refresh
      </button>
      <button
        onClick={() => setShowUpdate(false)}
        aria-label="Dismiss update notification"
        style={{
          padding: "0.25rem",
          backgroundColor: "transparent",
          color: "rgba(255, 255, 255, 0.7)",
          border: "none",
          fontSize: "1.125rem",
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        &times;
      </button>
    </div>
  );
}
