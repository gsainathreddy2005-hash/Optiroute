export const USD_TO_INR_RATE = 83.50;

/**
 * Formats a given USD amount in both USD ($) and INR (₹).
 * Example: formatDualCurrency(0.0015) -> "$0.0015 (₹0.125)"
 * Or formatted according to mode: 'both', 'usd', 'inr'.
 */
export function formatDualCurrency(usdAmount = 0, mode = 'both') {
  const usd = typeof usdAmount === 'number' ? usdAmount : parseFloat(usdAmount || 0);
  const inr = usd * USD_TO_INR_RATE;

  const formattedUSD = usd < 0.01 && usd > 0 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(2)}`;
  const formattedINR = inr < 0.1 && inr > 0 ? `₹${inr.toFixed(3)}` : `₹${inr.toFixed(2)}`;

  if (mode === 'usd') return formattedUSD;
  if (mode === 'inr') return formattedINR;
  return `${formattedUSD} / ${formattedINR}`;
}

export function formatPricePair(usdAmount = 0) {
  const usd = typeof usdAmount === 'number' ? usdAmount : parseFloat(usdAmount || 0);
  const inr = usd * USD_TO_INR_RATE;
  return {
    usd: `$${usd.toFixed(2)}`,
    inr: `₹${inr.toFixed(0)}`
  };
}
