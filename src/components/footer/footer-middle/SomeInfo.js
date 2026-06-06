import { useTheme } from "@emotion/react";
import { Typography, useMediaQuery } from "@mui/material";
import React from "react";
import {
  CustomStackFullWidth,
  CustomTypographyBold,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import Link from "next/link";

const SomeInfo = (props) => {
  const { image, alt, title, info, t, href } = props;
  const theme = useTheme();
  const isXsmall = useMediaQuery(theme.breakpoints.down("sm"));
  const formattedTitle = isXsmall ? t(title).toLocaleUpperCase("ka-GE") : t(title);
  const iconSize = isXsmall ? 38 : 50;
  const titleSx = {
    textTransform: isXsmall ? "uppercase" : "capitalize",
    fontSize: { xs: "12px", sm: "inherit" },
    lineHeight: { xs: 1.35, sm: "normal" },
    fontWeight: { xs: 700, sm: "inherit" },
    letterSpacing: 0,
    textAlign: "center",
  };
  const infoSx = {
    textAlign: "center",
    fontSize: { xs: "11px", sm: "inherit" },
    lineHeight: { xs: 1.35, sm: "normal" },
    letterSpacing: 0,
    maxWidth: { xs: "230px", sm: "none" },
  };
  return (
    <>{href ? (
      <Link href={href}>
        <CustomStackFullWidth
          alignItems="center"
          justifyContent="center"
          spacing={isXsmall ? 1.2 : 3}
          sx={{
            cursor: "pointer",
            img: {
              transition: "all ease 0.5s",
            },
            "&:hover": {
              ".MuiTypography-body1": {
                color: theme.palette.primary.main,
              },
              ".MuiTypography-body2": {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <CustomImageContainer src={image.src} alt={alt} height={iconSize} width={iconSize} />
          <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <CustomTypographyBold
              sx={titleSx}
            >
              {formattedTitle}
            </CustomTypographyBold>
            <Typography
              variant="body2"
              sx={infoSx}
            >
              {info}
            </Typography>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </Link>
    ) : (
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={isXsmall ? 1.2 : 3}
        sx={{
          cursor: "pointer",
          img: {
            transition: "all ease 0.5s",
          },
          "&:hover": {
            ".MuiTypography-body1": {
              color: theme.palette.primary.main,
            },
            ".MuiTypography-body2": {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <CustomImageContainer src={image.src} alt={alt} height={iconSize} width={iconSize} />
        <CustomStackFullWidth
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <CustomTypographyBold
            sx={titleSx}
          >
            {formattedTitle}
          </CustomTypographyBold>
          <Typography
            variant="body2"
            sx={infoSx}
          >
            {info}
          </Typography>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    )

    }
    </>
  );
};

SomeInfo.propTypes = {};

export default SomeInfo;
