import assert from "node:assert/strict";
import test from "node:test";
import { getCanonicalRedirectUrl } from "../src/utils/middlewareRedirectUrl.mjs";

const request = ({
  origin = "https://localhost:3002",
  pathname = "/home",
  search = "?module=sakvebi",
  headers = {},
} = {}) => ({
  nextUrl: { origin, pathname, search },
  headers: {
    get(name) {
      return headers[name.toLowerCase()] ?? null;
    },
  },
});

test("middleware redirects use the configured public origin behind a loopback proxy", () => {
  const previous = process.env.NEXT_CLIENT_HOST_URL;
  process.env.NEXT_CLIENT_HOST_URL = "https://mili.ge/";

  try {
    assert.equal(
      getCanonicalRedirectUrl(request()).toString(),
      "https://mili.ge/home?module=sakvebi",
    );
  } finally {
    if (previous === undefined) delete process.env.NEXT_CLIENT_HOST_URL;
    else process.env.NEXT_CLIENT_HOST_URL = previous;
  }
});

test("trusted forwarded headers are the fallback when no public origin is configured", () => {
  const previous = process.env.NEXT_CLIENT_HOST_URL;
  delete process.env.NEXT_CLIENT_HOST_URL;

  try {
    assert.equal(
      getCanonicalRedirectUrl(
        request({
          headers: {
            "x-forwarded-host": "mili.ge",
            "x-forwarded-proto": "https",
          },
        }),
      ).toString(),
      "https://mili.ge/home?module=sakvebi",
    );
  } finally {
    if (previous === undefined) delete process.env.NEXT_CLIENT_HOST_URL;
    else process.env.NEXT_CLIENT_HOST_URL = previous;
  }
});

test("middleware route overrides preserve the trusted origin", () => {
  const previous = process.env.NEXT_CLIENT_HOST_URL;
  process.env.NEXT_CLIENT_HOST_URL = "https://mili.ge";

  try {
    assert.equal(
      getCanonicalRedirectUrl(request(), {
        pathname: "/home",
        search: "",
      }).toString(),
      "https://mili.ge/home",
    );
  } finally {
    if (previous === undefined) delete process.env.NEXT_CLIENT_HOST_URL;
    else process.env.NEXT_CLIENT_HOST_URL = previous;
  }
});
