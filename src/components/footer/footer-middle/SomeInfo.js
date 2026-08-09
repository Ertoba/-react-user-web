import { useTheme } from "@emotion/react";
import { Box, Typography, alpha, useMediaQuery } from "@mui/material";
import React from "react";
import {
  CustomStackFullWidth,
  CustomTypographyBold,
} from "styled-components/CustomStyles.style";
import Link from "next/link";

const SomeInfo = (props) => {
  const { icon, title, info, t, href } = props;
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
  const iconView = (
    <Box
      sx={{
        width: iconSize,
        height: iconSize,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        transition: "transform 180ms ease, background-color 180ms ease",
        "& svg": {
          fontSize: isXsmall ? 24 : 30,
        },
      }}
    >
      {icon}
    </Box>
  );
  return (
    <>{href ? (
      <Link href={href}>
        <CustomStackFullWidth
          alignItems="center"
          justifyContent="center"
          spacing={isXsmall ? 1.2 : 3}
          sx={{
            cursor: "pointer",
            "&:hover": {
              "& > .MuiBox-root": {
                transform: "translateY(-2px)",
                backgroundColor: alpha(theme.palette.primary.main, 0.18),
              },
              ".MuiTypography-body1": {
                color: theme.palette.primary.main,
              },
              ".MuiTypography-body2": {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          {iconView}
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
          "&:hover": {
            "& > .MuiBox-root": {
              transform: "translateY(-2px)",
              backgroundColor: alpha(theme.palette.primary.main, 0.18),
            },
            ".MuiTypography-body1": {
              color: theme.palette.primary.main,
            },
            ".MuiTypography-body2": {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        {iconView}
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
