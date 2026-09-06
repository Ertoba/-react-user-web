import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import ManageSearch from "../header/second-navbar/ManageSearch";
import TrackParcelFromHomePage from "../parcel/TrackParcelFromHomePage";
import { useSelector } from "react-redux";
import { georgianCapsFontFamily, toGeorgianUpper } from "utils/georgianText";

const SearchWithTitle = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const moduleType = getCurrentModuleType();
  const { zoneid, token, searchQuery, name, query, currentTab } = props;
  const { configData } = useSelector((state) => state.configData);
  const categoryName = Array.isArray(name) ? name[0] : name;
  const isCategorySearch = query?.data_type === "category" && categoryName;

  const getBannerTexts1 = t("Get your car rental service with");
  const getBannerSubTexts = t("with affordable price.");

  const getBannerTexts = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          title: "Fresh Item that deserve to eat",
          subTitle: "Get your groceries items delivered in less than an hour",
        };
      case ModuleTypes.PHARMACY:
        return {
          title: "Quality Medicines & Health care at your Doorstep.",
          subTitle: "",
        };
      case ModuleTypes.ECOMMERCE:
        return {
          title: "Exclusive collection for everyone",
          subTitle: "Get Your Desired High Quality Products Here",
        };
      case ModuleTypes.FOOD:
        return {
          title: "FIND YOUR HAPPINESS",
          subTitle: "For the love of delicious food.",
        };
      case ModuleTypes.PARCEL:
        return {
          title: "Track your Products",
          subTitle: "Now you can track your products easily whenever you want.",
        };
      case ModuleTypes.RENTAL:
        return {
          title: "Rent best car for best experience",
          subTitle: `${getBannerTexts1} ${configData?.business_name} ${getBannerSubTexts}`,
        };
      default:
        return {
          title: "",
          subTitle: "",
        };
    }
  };
  const bannerTitle = isCategorySearch ? categoryName : t(getBannerTexts().title);
  const displayBannerTitle =
    moduleType === ModuleTypes.PARCEL || isCategorySearch
      ? toGeorgianUpper(bannerTitle)
      : bannerTitle;

  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="center"
      spacing={{ xs: 0.75, sm: 1.5, md: 3 }}
      px={{ xs: 1.5, sm: 2.5 }}
      py={{ xs: 2, sm: 2.5 }}
      mt={moduleType === ModuleTypes.RENTAL ? { xs: 0, sm: 2 } : 0}
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 1, sm: 1.5 }}
      >
        <Typography
          variant={isSmall ? "h6" : "h5"}
          textAlign="center"
          fontWeight="600"
          component="h1"
          sx={{
            fontSize: isCategorySearch
              ? { xs: "19px", sm: "25px", md: "34px" }
              : {
                  xs: "19px",
                  sm: "23px",
                  md: moduleType === ModuleTypes.RENTAL ? "30px" : "24px",
                },
            lineHeight: isCategorySearch
              ? { xs: 1.28, sm: 1.3, md: 1.25 }
              : { xs: 1.28, sm: 1.3, md: 1.35 },
            pt: isCategorySearch ? "2px" : 0,
            maxWidth: { xs: "94vw", md: "720px" },
            overflowWrap: "break-word",
            wordBreak: "normal",
            color:
              moduleType === ModuleTypes.PARCEL
                ? "#039D55 !important"
                : "inherit",
            textShadow: "none",
            fontFamily:
              moduleType === ModuleTypes.PARCEL || isCategorySearch
                ? georgianCapsFontFamily
                : "inherit",
            textTransform:
              moduleType === ModuleTypes.RENTAL ? "capitalize" : "initial",
          }}
        >
          {displayBannerTitle}
        </Typography>
        <Typography
          variant={isSmall ? "subtitle2" : "subtitle1"}
          textAlign="center"
          sx={{
            color:
              moduleType === ModuleTypes.PARCEL
                ? "#374151 !important"
                : (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.neutral[1000]
                      : theme.palette.neutral[400],
            textShadow: "none",
            fontSize: { xs: "12.5px", sm: "14px", md: "16px" },
            lineHeight: { xs: "18px", sm: "20px", md: "22px" },
            overflowWrap: "break-word",
            wordBreak: "normal",
          }}
          fontWeight="400"
          component="p"
        >
          {t(getBannerTexts().subTitle)}
        </Typography>
      </CustomStackFullWidth>

      {moduleType === "parcel" ? (
        <TrackParcelFromHomePage />
      ) : moduleType === "rental" ? null : (
        <ManageSearch
          zoneid={zoneid}
          token={token}
          maxwidth="false"
          fullWidth
          searchQuery={searchQuery}
          name={name}
          query={query}
          currentTab={currentTab}
        />
      )}
    </CustomStackFullWidth>
  );
};

export default SearchWithTitle;
