import { Typography, alpha, styled } from "@mui/material";
import { Box, Stack } from "@mui/system";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { setSelectedModule } from "redux/slices/utils";
import { getModuleIdentifier, saveModuleParam } from "../../../../utils/moduleParamManager";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { IsSmallScreen } from "utils/CommonValues";

import { settings } from "./sliderSettings";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import { setModules } from "redux/slices/configData";
import { getModuleDisplayName } from "helper-functions/getModuleDisplayName";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NextImage from "components/NextImage";
import EastIcon from '@mui/icons-material/East';

const CardWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: "inherit",
  padding: "14px",
  border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all ease 0.5s",
  position: "relative",
  zIndex: "99",
  justifyContent: "space-between",
  boxShadow: "0px 8px 15px 0px #1C1E2008, 0px 0px 2px 0px #1C1E2014",
  // Mobile: 2 cards per row
  [theme.breakpoints.down('sm')]: {
    width: "calc(50% - 7.5px)",
    flex: "0 0 calc(50% - 7.5px)",
    minWidth: "unset",
  },
  // Desktop: fixed width
  [theme.breakpoints.up('sm')]: {
    minWidth: "170px",
    flex: "none",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.primary.main, 0.22)
        : alpha(theme.palette.primary.main, 0.12),
    borderColor: alpha(theme.palette.primary.main, 0.55),
    color: theme.palette.text.primary,
    boxShadow: `0px 10px 24px ${alpha(theme.palette.primary.main, 0.18)}`,
    ".text": {
      color: theme.palette.text.secondary,
    },
    ".arrow": {
      color: theme.palette.primary.main,
    },
  },
}));

const LeftSection = styled(Stack)(({ theme }) => ({
  alignItems: "flex-start",
  gap: "8px",
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  width: "50px",
  height: "50px",
  position: "relative",
  borderRadius: "8px",
  boxShadow: "0px 2px 5px 0px #00000014",
  overflow: "hidden",
  "& img": {
    filter:
      "brightness(0) saturate(100%) invert(38%) sepia(80%) saturate(941%) hue-rotate(113deg) brightness(90%) contrast(96%)",
  },
}));

const ArrowWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "12px",
  right: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  transition: "color 0.3s ease",
}));

const getDisplayCount = (count) => {
  const value = Number(count) || 0;
  return value > 2 ? `${value - 1}+` : `${value}`;
};

const getModuleSummary = (item, t) => {
  const moduleType = item?.module_type;
  const moduleSlug = String(item?.slug || "").trim().toLowerCase();
  const moduleName = String(item?.module_name || "").trim().toLowerCase();

  if (moduleType === "parcel") return "";

  if (moduleType === "ecommerce") {
    return `${getDisplayCount(item?.items_count)} ${t("Product")}`;
  }

  const storeCount = getDisplayCount(item?.stores_count);

  if (moduleType === "grocery") return `${storeCount} მარკეტი`;
  if (moduleType === "pharmacy") return `${storeCount} აფთიაქი`;
  if (moduleType === "food" && (moduleSlug === "ludi" || moduleName === "ლუდი")) {
    return `${storeCount} ბარი`;
  }
  if (moduleType === "food") return `${storeCount} რესტორანი`;
  if (moduleType === "rental") return `${storeCount} ${t("Providers")}`;

  return `${storeCount} ${t("Stores")}`;
};

const Card = ({ item, handleClick }) => {
  const { t } = useTranslation();
  const moduleDisplayName = getModuleDisplayName(item, t);
  const moduleSummary = getModuleSummary(item, t);

  return (
    <CardWrapper onClick={() => handleClick(item)}>
      <LeftSection>
        <ImageWrapper>
          <NextImage
            src={item?.icon_full_url}
            alt={moduleDisplayName}
            height={50}
            width={50}
            objectFit="contain"
            borderRadius="8px"
            priority
          />
        </ImageWrapper>

        <Stack spacing={0.5}>
          <Typography
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              fontSize: { xs: "13px", md: "18px" },
            }}

          >
            {moduleDisplayName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="text"
            sx={{
              fontSize: "12px",
              minHeight: "16px", // Reserve space even when empty
              visibility: moduleSummary ? "visible" : "hidden"
            }}
          >
            {moduleSummary}
          </Typography>
        </Stack>
      </LeftSection>

      <ArrowWrapper className="arrow">
        <EastIcon sx={{
          fontSize: "20px",
          color: "primary",
          transform: (theme) => theme.direction === 'rtl' ? 'scaleX(-1)' : 'none'
        }} />
      </ArrowWrapper>
    </CardWrapper>
  );
};

const ModuleSelectionRaw = (props) => {
  const { isSmall } = props;
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.configData);
  const [isSelected, setIsSelected] = useState(getCurrentModuleType());
  const { data, refetch } = useGetModule();
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    if (data) {
      dispatch(setModules(data));
    }
  }, [data]);
console.log({data,modules});

  const router = useRouter();

  const handleClick = (item) => {
    setIsSelected(item?.module_type);
    dispatch(setSelectedModule(item));
    localStorage.setItem("module", JSON.stringify(item));
    
    // Get module identifier (slug if available, otherwise id)
    const moduleIdentifier = getModuleIdentifier(item);
    
    // Save module to localStorage and cookie
    saveModuleParam(item?.id, item?.slug);
    
    router.replace(
      { pathname: "/home", query: { module: moduleIdentifier } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <CustomStackFullWidth
        justifyContent={{
          xs: "flex-start", // Left align on mobile for 2-column layout
          sm: "center" // Center on larger screens
        }}
        flexDirection="row"
        alignItems="center"
        flexWrap="wrap"
        gap="15px"
        mt="10px"
      >
        {modules?.length > 0 &&
          modules.map((item, index) => {
            return (
              <Card
                key={index}
                item={item}
                isSelected={isSelected}
                handleClick={handleClick}
              />
            );
          })}
      </CustomStackFullWidth>
    </>
  );
};

ModuleSelectionRaw.propTypes = {};

export default ModuleSelectionRaw;
