"use client";

import { useEffect } from "react";

// Registers the service worker so the app loads instantly and works offline.
export function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Never run the cache in dev — it fights HMR and serves stale bundles.
    if (process.env.NODE_ENV !== "production") return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {
      /* offline support is a progressive enhancement — ignore failures */
    });
  }, []);
  return null;
}
