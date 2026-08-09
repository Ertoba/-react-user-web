import React from "react";
import { Stack } from "@mui/system";
import { Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import CustomCopyWithTooltip from "../custom-copy-with-tooltip";
import { useTheme } from "@emotion/react";
import { CodePreviewWrapper } from "./ReferralCode.style";
import ReferralShare from "./ReferralShare";
import { t } from "i18next";
import { getReferralLink } from "helper-functions/referralLink";

const CodePreview = (props) => {
  const theme = useTheme();
  const isXsmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const referralLink = getReferralLink(profileInfo?.ref_code);
  return (
    <Stack
      sx={{ p: "1rem" }}
      gap={{xs:"10px", sm:"15px", md:"20px"}}
      maxWidth="450px"
      width="100%"
      justifyContent="center"
    >
      <CodePreviewWrapper
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography fontWeight="600" color={theme.palette.primary.main}>
          {profileInfo?.ref_code}{" "}
        </Typography>
        <CustomCopyWithTooltip t={t} value={profileInfo?.ref_code} />
      </CodePreviewWrapper>
      <CodePreviewWrapper
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <Typography
          fontWeight="600"
          color={theme.palette.primary.main}
          noWrap
          sx={{ minWidth: 0, fontSize: { xs: "12px", sm: "14px" } }}
        >
          {referralLink}
        </Typography>
        <CustomCopyWithTooltip t={t} value={referralLink} />
      </CodePreviewWrapper>
      <Typography>
        {t("OR SHARE")}
      </Typography>
        <ReferralShare referralCode={profileInfo?.ref_code} size={isXsmall ? 30 : 40 }/>
    </Stack>
  );
};

export default CodePreview;
