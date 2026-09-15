import FxRate, { IFxRate } from "@/app/(backend)/models/FxRate";

const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // 24 hours
const FX_API_URL = "https://open.er-api.com/v6/latest"; // no API key required

/**
 * Always hits the upstream API and overwrites the cached document for
 * this base currency. Use this from a scheduled job, or as the fallback
 * inside getFxRates() when the cache is stale/missing.
 */
export async function refreshFxRates(base: string): Promise<IFxRate> {
  const normalizedBase = base.toUpperCase();

  const res = await fetch(`${FX_API_URL}/${normalizedBase}`);
  if (!res.ok) {
    throw new Error(`FX refresh failed for base ${normalizedBase}: ${res.status}`);
  }

  const data = await res.json();

  if (data.result !== "success" || !data.rates) {
    throw new Error(`FX provider returned an error for base ${normalizedBase}`);
  }

  const doc = await FxRate.findOneAndUpdate(
    { base: normalizedBase },
    {
      base: normalizedBase,
      rates: data.rates,
      source: "open.er-api.com",
      fetchedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  return doc;
}

/**
 * Returns cached rates for `base`, refreshing first if the cache is
 * missing or older than 24 hours. This is what order-ingestion code
 * should call — it never hits the upstream API more than once a day
 * per base currency, regardless of how many orders come in.
 */
export async function getFxRates(base: string): Promise<Map<string, number>> {
  const normalizedBase = base.toUpperCase();

  const cached = await FxRate.findOne({ base: normalizedBase });

  const isStale =
    !cached || Date.now() - new Date(cached.fetchedAt).getTime() > STALE_AFTER_MS;

  if (isStale) {
    const fresh = await refreshFxRates(normalizedBase);
    return fresh.rates;
  }

  return cached.rates;
}

/**
 * Convenience wrapper for your actual use case: convert an order amount
 * in `currency` into PKR, using a cached (auto-refreshed-if-stale) rate.
 * Returns the rate used alongside the converted amount so it can be
 * stored on the order for audit purposes (see totalPricePKR / fxRate /
 * fxRateDate fields on the Order schema).
 */
export async function convertToPKR(
  amount: number,
  currency: string,
): Promise<{ amountPKR: number; rate: number; fetchedAt: Date }> {
  const normalizedCurrency = currency.toUpperCase();

  if (normalizedCurrency === "PKR") {
    return { amountPKR: amount, rate: 1, fetchedAt: new Date() };
  }

  // Rates are cached per base currency. Using the order's own currency
  // as the base means one lookup gives us currency -> PKR directly,
  // without needing to convert through USD as an intermediate step.
  const rates = await getFxRates(normalizedCurrency);
  const rate = rates.get("PKR");

  if (rate === undefined) {
    throw new Error(`No PKR rate available for base currency ${normalizedCurrency}`);
  }

  const amountPKR = Math.round(amount * rate * 100) / 100;

  return { amountPKR, rate, fetchedAt: new Date() };
}