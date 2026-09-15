// lib/shopify-webhook.ts
import crypto from "crypto";

export async function verifyShopifyWebhook(
  request: Request,
  hmac: string,
  secret: string,
): Promise<boolean> {
  try {
    // Read the raw body
    const body = await request.arrayBuffer();
    if (!body) return false;

    // Shopify uses the raw body to calculate HMAC
    const calculatedHmac = crypto
      .createHmac("sha256", secret)
      .update(Buffer.from(body))
      .digest("base64");

    return crypto.timingSafeEqual(
      Buffer.from(calculatedHmac),
      Buffer.from(hmac),
    );
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
}
