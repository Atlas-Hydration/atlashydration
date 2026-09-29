"use client";

import { useEffect } from "react";
import { loadKlaviyo } from "@/app/lib/klaviyo";

/** Loads Klaviyo's onsite script on every page so its native signup form can run. */
export default function KlaviyoOnsite() {
  useEffect(() => {
    loadKlaviyo();
  }, []);
  return null;
}
