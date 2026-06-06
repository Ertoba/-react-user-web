import { useTheme } from "@emotion/react";
import { Typography, useMediaQuery } from "@mui/material";
import { Router, useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { RouteLinksData } from "../demoLinks";
import { setAllData } from "redux/slices/storeRegistrationData";
import { useDispatch, useSelector } from "react-redux";

const RouteLinks = (props) => {
  const dispatch = useDispatch();
  const { selectedModule } = useSelector((state) => state.utilsData);

  const { token, configData } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const handleClick = (href, value) => {
    if (value === "loyalty_points" || value === "my_wallet") {
      if (token) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must be login to access this page."));
      }
    } else if (value === "campaigns") {
      const zoneId = localStorage.getItem("zoneid");
      if (zoneId) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must pick a zone to access this page."));
      }
    } else if (value === "restaurant_owner") {
      dispatch(setAllData(null));
      router.push(
        {
          pathname: href,
          query: { active: "active" }, // Add your query parameter here
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(href, undefined, { shallow: true });
    }
  };
  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };
  const theme = useTheme();
  const isXsmall = useMediaQuery(theme.breakpoints.down("sm"));
  console.log({ configData });

  const formatFooterLink = (text) =>
    isXsmall ? t(text).toLocaleUpperCase("ka-GE") : t(text);
  const footerLinkSx = {
    textAlign: "left",
    cursor: "pointer",
    fontSize: { xs: "11px", sm: "inherit" },
    lineHeight: { xs: 1.35, sm: "normal" },
    fontWeight: { xs: 600, sm: "inherit" },
    letterSpacing: 0,
    flex: { xs: "0 0 calc(50% - 8px)", sm: "initial" },
    "&:hover": {
      color: theme.palette.primary.main,
    },
  };

  return (
    <CustomStackFullWidth
      direction={{ xs: "row", sm: "column" }}
      spacing={{ xs: 0, sm: 2 }}
      alignItems={{ xs: "flex-start", sm: "start" }}
      sx={{
        flexWrap: { xs: "wrap", sm: "nowrap" },
        columnGap: { xs: "16px", sm: 0 },
        rowGap: { xs: "10px", sm: 0 },
      }}
    >
      {RouteLinksData.map((item, index) => {
        if (
          (!configData?.toggle_store_registration && item?.value === "restaurant_owner") ||
          (!configData?.toggle_dm_registration && item?.value === "delivery_man")
        ) {
          return null;
        }
        return (
          <Typography
            key={index}
            onClick={() => handleClick(item.link, item.value)}
            sx={footerLinkSx}
          >
            {formatFooterLink(item.name)}
          </Typography>
        );
      })}

      <Typography
        onClick={() => handleClickToRoute("/about-us")}
        sx={footerLinkSx}
      >
        {formatFooterLink("About Us")}
      </Typography>
      <Typography
        onClick={() => handleClickToRoute("/track-order")}
        sx={footerLinkSx}
      >
        {selectedModule?.module_type === "rental" ? formatFooterLink("Track Trip") : formatFooterLink("Track Order")}
      </Typography>
    </CustomStackFullWidth>
  );
};

RouteLinks.propTypes = {};

export default RouteLinks;
