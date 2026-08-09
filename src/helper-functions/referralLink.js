export const PENDING_REFERRAL_CODE_KEY = "pending_referral_code";

export const sanitizeReferralCode = (value) => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  return String(rawValue ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64);
};

export const getReferralLink = (code, origin) => {
  const sanitizedCode = sanitizeReferralCode(code);
  const resolvedOrigin =
    origin || (typeof window !== "undefined" ? window.location.origin : "");

  if (!resolvedOrigin || !sanitizedCode) return "";

  return `${resolvedOrigin}/refer-and-earn?code=${encodeURIComponent(
    sanitizedCode
  )}`;
};
