/**
 * Klaviyo subscribe helper (client → server route)
 *
 * Calls our own /api/klaviyo-subscribe endpoint which uses the Private API Key
 * server-side. This avoids CORS issues and client-side API complexity.
 */

interface SubscribeOptions {
  email: string;
  source?: string;
  properties?: Record<string, string>;
}

export async function subscribeToKlaviyo({
  email,
  source = "Website",
  properties = {},
}: SubscribeOptions): Promise<boolean> {
  try {
    const res = await fetch("/api/klaviyo-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, properties }),
    });

    if (res.ok) {
      console.log(`[Klaviyo] ✓ Subscribed ${email}`);
      return true;
    }

    const errJson = await res.json().catch(() => ({}));
    console.error(`[Klaviyo] ✗ Subscribe failed:`, res.status, errJson);
    return false;
  } catch (err) {
    console.error("[Klaviyo] ✗ Subscribe exception:", err);
    return false;
  }
}
