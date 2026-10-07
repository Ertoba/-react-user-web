import { LandingLayout } from "components/layout/LandingLayout";
import LandingPage from "../src/components/landing-page";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData, setLandingPageData } from "redux/slices/configData";
import Router from "next/router";
import SEO from "../src/components/seo";
import useGetLandingPage from "../src/api-manage/hooks/react-query/useGetLandingPage";
import { checkMaintenanceMode } from "../src/utils/serverSidePropsHelper";
import { getApiContent } from "../src/api-manage/getApiContent";

const Root = (props) => {
  const { configData, landingPageData } = props;
  const { data } = useGetLandingPage();
  const effectiveLandingPageData = data ?? landingPageData;
  const dispatch = useDispatch();
  // getServerSideProps already fetched /api/v1/config and handed it to us as
  // `configData`. Refetching it client-side duplicated a 169-key payload on
  // every landing page load for data we already had, so seed redux from the
  // SSR props instead.
  useEffect(() => {
    dispatch(setLandingPageData(effectiveLandingPageData));
    if (configData) {
      if (Array.isArray(configData) && configData.length === 0) {
        Router.push("/404");
      } else {
        dispatch(setConfigData(configData));
      }
    }
  }, [configData, effectiveLandingPageData, dispatch]);
  return (
    <>
      <CssBaseline />
      {/* <DynamicFavicon configData={configData} /> */}
      <SEO
        image={effectiveLandingPageData?.meta_image || configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
        title={effectiveLandingPageData?.meta_title || configData?.business_name}
        description={
          effectiveLandingPageData?.meta_description || configData?.meta_description
        }
      />
      {effectiveLandingPageData && (
        <LandingLayout configData={configData} landingPageData={effectiveLandingPageData}>
          <LandingPage configData={configData} landingPageData={effectiveLandingPageData} />
        </LandingLayout>
      )}
    </>
  );
};
export default Root;
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const language = req.cookies.languageSetting;

  const configRes = await fetch(
    `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    },
  );
  const config = getApiContent(await configRes.json());

  if (checkMaintenanceMode(config)) {
    return {
      redirect: {
        destination: "/maintainance",
        permanent: false,
      },
    };
  }

  const landingPageRes = await fetch(
    `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}/api/v1/react-landing-page`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    },
  );
  const landingPageData = getApiContent(await landingPageRes.json()) ?? null;
  // Set cache control headers for 1 hour (3600 seconds)
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate",
  );

  return {
    props: {
      configData: config,
      landingPageData: landingPageData,
    },
  };
};
