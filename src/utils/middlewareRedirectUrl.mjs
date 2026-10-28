const firstHeaderValue = (value) =>
  typeof value === "string" ? value.split(",")[0].trim() : "";

const validOrigin = (value) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
};

const trustedOrigin = (request) => {
  const configured = validOrigin(
    (process.env.NEXT_CLIENT_HOST_URL || "").trim().replace(/\/+$/, ""),
  );
  if (configured) return configured;

  const headers = request?.headers;
  const host =
    firstHeaderValue(headers?.get?.("x-forwarded-host")) ||
    firstHeaderValue(headers?.get?.("host"));
  const forwardedProtocol = firstHeaderValue(
    headers?.get?.("x-forwarded-proto"),
  ).toLowerCase();
  const protocol = forwardedProtocol === "http" ? "http" : "https";
  const forwarded = validOrigin(host ? protocol + "://" + host : "");

  return forwarded || request.nextUrl.origin;
};

export const getCanonicalRedirectUrl = (request, overrides = {}) => {
  const pathname = overrides.pathname ?? request.nextUrl.pathname;
  const search = overrides.search ?? request.nextUrl.search;
  const url = new URL(pathname, trustedOrigin(request));
  url.search = search;
  return url;
};
