import { Box, Stack, styled } from "@mui/material";
import HeaderComponent from "../header";
import FooterComponent from "../footer";
import PropTypes from "prop-types";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  isWebsiteTestModeEnabled,
  WEBSITE_TEST_MODE_BANNER_HEIGHT,
} from "../header/WebsiteTestModeBanner";

export const MainLayoutRoot = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));

export const LandingLayout = ({ children, configData, landingPageData }) => {
  const { data, refetch } = useGetLandingPage();
  const { configData: runtimeConfigData } = useSelector(
    (state) => state.configData
  );
  const effectiveConfigData = runtimeConfigData ?? configData;
  const websiteTestModeOffset = isWebsiteTestModeEnabled(effectiveConfigData)
    ? `${WEBSITE_TEST_MODE_BANNER_HEIGHT}px`
    : "0px";
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <MainLayoutRoot justifyContent="space-between">
      <header>
        <HeaderComponent configData={effectiveConfigData} />
      </header>
      <Box sx={{ paddingTop: websiteTestModeOffset }}>{children}</Box>
      <footer>
        <FooterComponent configData={configData} landingPageData={data} />
      </footer>
    </MainLayoutRoot>
  );
};

LandingLayout.propTypes = {
  children: PropTypes.node,
};
