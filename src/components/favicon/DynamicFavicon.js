import React from "react";
import Head from "next/head";
import {
  miliAppleTouchIconSrc,
  miliFaviconSrc,
} from "components/logo/brandAssets";

const DynamicFavicon = () => {
  const faviconHref = `${miliFaviconSrc}?v=20260529`;
  const appleTouchIconHref = `${miliAppleTouchIconSrc}?v=20260529`;

  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={appleTouchIconHref}
      />
      <link rel="icon" href={faviconHref} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={faviconHref}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={faviconHref}
      />
    </Head>
  );
};

DynamicFavicon.propTypes = {};

export default DynamicFavicon;
