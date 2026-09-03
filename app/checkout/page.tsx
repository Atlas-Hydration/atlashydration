"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CheckoutRedirect() {
  useEffect(() => {
    window.location.replace("/");
  }, []);

  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 20px" }}>
      <div>
        <p style={{ marginBottom: 12 }}>Taking you to Atlas Hydration…</p>
        <Link href="/">Continue to atlas-hydration.com</Link>
      </div>
    </main>
  );
}
