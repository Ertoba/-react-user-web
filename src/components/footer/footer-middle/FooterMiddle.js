import { Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box, alpha } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ractangle from "../../../../public/static/footer/Rectangle.svg";
import magnifying from "../../../../public/static/footer/magnifying.svg";
import phone from "../../../../public/static/footer/phone.svg";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import AppLinks from "./AppLinks";
import RouteLinks from "./RouteLinks";
import SocialLinks from "./SocialLinks";
import SomeInfo from "./SomeInfo";
import { useRouter } from "next/router";
import LocationViewOnMap from "../../Map/location-view/LocationViewOnMap";
import { miliLogoSrc } from "components/logo/brandAssets";
import { useDispatch, useSelector } from "react-redux";
import { setAllData } from "redux/slices/storeRegistrationData";

const FooterMiddle = (props) => {
  const { configData, landingPageData } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleOpenCloseMap = () => {
    setOpen(!open);
  };
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  let token;
  const businessLogo = miliLogoSrc;
  const formatMobileFooterLink = (text) => t(text).toLocaleUpperCase("ka-GE");
  const handleMobileFooterRoute = (href, value) => {
    if (value === "restaurant_owner") {
      dispatch(setAllData(null));
      router.push(
        {
          pathname: href,
          query: { active: "active" },
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(href, undefined, { shallow: true });
    }
  };
  const mobileFooterLinkSx = {
    cursor: "pointer",
    fontSize: "11px",
    lineHeight: 1.32,
    fontWeight: 700,
    letterSpacing: 0,
    textAlign: "left",
    color: "inherit",
    overflowWrap: "break-word",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  };
  const mobileLeftFooterLinks = [
    configData?.toggle_store_registration && {
      name: "Become a Vendor owner",
      value: "restaurant_owner",
      link: "/store-registration",
    },
    {
      name: "Help & Support",
      link: "/help-and-support",
    },
    {
      name: selectedModule?.module_type === "rental" ? "Track Trip" : "Track Order",
      link: "/track-order",
    },
    {
      name: "Terms & Conditions",
      link: "/terms-and-conditions",
    },
    configData?.refund_policy !== 0 && {
      name: "Refund Policy",
      link: "/refund-policy",
    },
    configData?.cancelation_policy !== 0 && {
      name: "Cancellation Policy",
      link: "/cancellation-policy",
    },
    configData?.shipping_policy !== 0 && {
      name: "Shipping Policy",
      link: "/shipping-policy",
    },
  ].filter(Boolean);
  const mobileRightFooterLinks = [
    configData?.toggle_dm_registration && {
      name: "Become a delivery man",
      value: "delivery_man",
      link: "/deliveryman-registration",
    },
    {
      name: "About Us",
      link: "/about-us",
    },
    {
      name: "Privacy Policy",
      link: "/privacy-policy",
    },
  ].filter(Boolean);
  // console.log("landingPageData", landingPageData);
  return (
    <CustomStackFullWidth sx={{ py: { xs: "10px", sm: "3rem" } }}>
      <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="flex-start">
        <Grid item xs={12} sm={6} md={4.2}>
          <CustomStackFullWidth
            // spacing={2}
            gap="10px"
            alignItems={{ xs: "center", sm: "flex-start" }}
            justifyContent="flex-start"
          >
            <Box
              sx={{
                img: {
                  transition: "all ease 0.5s",
                },
                "&:hover": {
                  img: {
                    transform: "scale(1.04)",
                  },
                },
              }}
            >
              <CustomImageContainer
                src={businessLogo}
                alt={`${configData?.business_name}`}
                width="auto"
                height="64px"
                objectfit="contain"
              />
            </Box>
            <SocialLinks
              configData={configData}
              landingPageData={landingPageData}
            />
            <AppLinks landingPageData={{
              app_store_link: landingPageData?.user_app_download_section?.download_user_app_links?.apple_store_url,
              play_store_link: landingPageData?.user_app_download_section?.download_user_app_links?.playstore_url,
              app_status: landingPageData?.user_app_download_section?.download_user_app_links?.apple_store_url_status,
              play_status: landingPageData?.user_app_download_section?.download_user_app_links?.playstore_url_status
            }} />
          </CustomStackFullWidth>
        </Grid>
        <Grid item xs={12} sm={6} md={7.8}>
          <Box
            sx={{
              position: "relative",
              height: "100%",
              "&::before": {
                content: '""',
                position: "absolute",
                borderRadius: "23px",
                inset: "0",
                background: theme.palette.background.default,
              },
            }}
          >
            <Box
              padding={{ xs: "18px 10px", sm: "40px" }}
              sx={{
                backgroundColor:
                  getCurrentModuleType() === ModuleTypes?.FOOD
                    ? alpha(theme.palette.moduleTheme.food, 0.051)
                    : alpha(theme.palette.primary.main, 0.051),
                borderRadius: "23px",
                position: "relative",
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={3} align={isSmall && "center"}>
                  {isSmall ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                        columnGap: "22px",
                        rowGap: "8px",
                        width: "100%",
                        px: "4px",
                        alignItems: "start",
                      }}
                    >
                      {[mobileLeftFooterLinks, mobileRightFooterLinks].map((links, columnIndex) => (
                        <Stack key={columnIndex} spacing="9px" alignItems="stretch">
                          {links.map((item) => (
                            <Typography
                              key={`${columnIndex}-${item.name}`}
                              onClick={() => handleMobileFooterRoute(item.link, item.value)}
                              sx={mobileFooterLinkSx}
                            >
                              {formatMobileFooterLink(item.name)}
                            </Typography>
                          ))}
                        </Stack>
                      ))}
                    </Box>
                  ) : (
                    <CustomStackFullWidth
                      flexDirection="row"
                      justifyContent="flex-start"
                      gap="10px"
                      sx={{ px: 0 }}
                    >
                      <RouteLinks token={token} configData={configData} />
                    </CustomStackFullWidth>
                    )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{
                    display: { xs: "flex", sm: "none", md: "flex" },
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <SomeInfo
                    image={ractangle}
                    alt="rantangle"
                    title="Send us mails"
                    info={configData?.email}
                    t={t}
                    href={`mailto:${configData?.email}`}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{
                    display: { xs: "flex", sm: "none", md: "flex" },
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <SomeInfo
                    image={phone}
                    alt="Phone"
                    title="Contact us"
                    info={configData?.phone}
                    t={t}
                    href={`tel:${configData?.phone}`}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{
                    display: { xs: "flex", sm: "none", md: "flex" },
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Box onClick={handleOpenCloseMap}>
                    <SomeInfo
                      image={magnifying}
                      alt="magnifying"
                      title="Find us here"
                      info={configData?.address}
                      t={t}
                      href={false}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: { xs: "none", sm: "inherit", md: "none" } }}
        >
          <Box
            sx={{
              width: "100%",
              backgroundColor:
                getCurrentModuleType() === ModuleTypes?.FOOD
                  ? alpha(theme.palette.moduleTheme.food, 0.05)
                  : alpha(theme.palette.primary.main, 0.05),
              borderRadius: "23px",
              padding: "30px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <SomeInfo
                  image={ractangle}
                  alt="rantangle"
                  title="Send us mails"
                  info={configData?.email}
                  t={t}
                  href={`mailto:${configData?.email}`}
                />
              </Grid>
              <Grid item xs={4}>
                <SomeInfo
                  image={phone}
                  alt="Phone"
                  title="Contact us"
                  info={configData?.phone}
                  t={t}
                  href={`tel:${configData?.phone}`}
                />
              </Grid>
              <Grid item xs={4}>
                <Box onClick={handleOpenCloseMap}>
                  <SomeInfo
                    image={magnifying}
                    alt="magnifying"
                    title="Find us here"
                    info={configData?.address}
                    href={false}
                    t={t}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {open && (
        <LocationViewOnMap
          open={open}
          handleClose={handleOpenCloseMap}
          latitude={configData?.default_location?.lat}
          longitude={configData?.default_location?.lng}
          address={configData?.address}
          isFooter
        />
      )}
    </CustomStackFullWidth>
  );
};

FooterMiddle.propTypes = {};

export default FooterMiddle;
