import {
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  EmailIcon,
  EmailShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import {
  CodePreviewWrapper,
  ReferralShareBox,
  ShareButton,
} from "./ReferralCode.style";
import ShareIcon from "@mui/icons-material/Share";
import { fb_app_id } from "../../utils/staticCredential";
import CustomModal from "../custom-component/CustomModal";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
import CustomCopyWithTooltip from "../custom-copy-with-tooltip";
import { SliderCustom } from "../../styled-components/CustomStyles.style";
import Slider from "react-slick";
import { referralSettings } from "./ReferralSettings";
import { getReferralLink } from "helper-functions/referralLink";

const ReferralShare = ({ referralCode, horizontal, size }) => {
  const [referralLink, setReferralLink] = useState("");
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const companyName = configData?.business_name;
  const iconSize = size || 40;
  useEffect(() => {
    setReferralLink(getReferralLink(referralCode));
  }, [referralCode]);
  const shareMessage = `${t("Hey there welcome to")} ${companyName}! ${t(
    "If you're checking out"
  )} ${companyName} ${t(
    "for the first time, make sure to use the referral code"
  )} ${referralCode} ${t(
    "when you sign up. It's my way of welcoming you to this awesome e-commerce platform! Happy shopping on"
  )} ${companyName}!`;
  const title = `${t("Hey there welcome to")} ${companyName}!`;

  return (
    <>
      <ReferralShareBox horizontal={horizontal}>
        <FacebookMessengerShareButton
          url={referralLink}
          appId={fb_app_id}
          quote={shareMessage}
        >
          <FacebookMessengerIcon size={iconSize} round />
        </FacebookMessengerShareButton>
        <TwitterShareButton url={referralLink} title={shareMessage}>
          <TwitterIcon size={iconSize} round />
        </TwitterShareButton>
        <WhatsappShareButton
          url={referralLink}
          separator=":: "
          title={shareMessage}
        >
          <WhatsappIcon size={iconSize} round />
        </WhatsappShareButton>
        <LinkedinShareButton
          title={title}
          url={referralLink}
          source={referralLink}
          summary={shareMessage}
        >
          <LinkedinIcon size={iconSize} round />
        </LinkedinShareButton>
        <ShareButton size={`${iconSize}px`} onClick={() => setOpen(true)}>
          <ShareIcon
            sx={{
              fontSize: `${Math.max(iconSize - 12, 18)}px`,
              color: theme.palette.info.main,
            }}
          />
        </ShareButton>
        <CustomModal openModal={open} setModalOpen={setOpen}>
          <Paper
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "350px", sm: "450px", md: "550px" },
              p: "1.2rem",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              padding: "40px",
            }}
          >
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <CloseIcon sx={{ fontSize: "22px" }} />
            </IconButton>
            <Typography fontSize="16px">{t("Share")}</Typography>
            <SliderCustom nopadding="true">
              <Slider {...referralSettings}>
                <FacebookMessengerShareButton
                  url={referralLink}
                  appId={fb_app_id}
                  quote={shareMessage}
                >
                  <FacebookMessengerIcon size={iconSize} round />
                </FacebookMessengerShareButton>
                <TwitterShareButton url={referralLink} title={shareMessage}>
                  <TwitterIcon size={iconSize} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={referralLink}
                  separator=":: "
                  title={shareMessage}
                >
                  <WhatsappIcon size={iconSize} round />
                </WhatsappShareButton>
                <LinkedinShareButton
                  title={title}
                  url={referralLink}
                  source={referralLink}
                  summary={shareMessage}
                >
                  <LinkedinIcon size={iconSize} round />
                </LinkedinShareButton>
                <TelegramShareButton url={referralLink} title={shareMessage}>
                  <TelegramIcon size={iconSize} round />
                </TelegramShareButton>
                <EmailShareButton
                  url={referralLink}
                  subject={title}
                  body={shareMessage}
                >
                  <EmailIcon size={iconSize} round />
                </EmailShareButton>
                <RedditShareButton
                  title={title}
                  url={referralLink}
                  windowWidth={660}
                  windowHeight={460}
                >
                  <RedditIcon size={iconSize} round />
                </RedditShareButton>
                <TumblrShareButton
                  url={referralLink}
                  title={title}
                  caption={shareMessage}
                >
                  <TumblrIcon size={iconSize} round />
                </TumblrShareButton>
                <LivejournalShareButton
                  url={referralLink}
                  title={title}
                  description={shareMessage}
                >
                  <LivejournalIcon size={iconSize} round />
                </LivejournalShareButton>
                <LineShareButton url={referralLink} title={shareMessage}>
                  <LineIcon size={iconSize} round />
                </LineShareButton>
              </Slider>
            </SliderCustom>
            <CodePreviewWrapper
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              padding="5px"
            >
              <Typography fontWeight="600" color={theme.palette.primary.main}>
                {referralLink}
              </Typography>
              <Stack padding="3px">
                <CustomCopyWithTooltip
                  t={t}
                  value={referralLink}
                  forModal={true}
                  companyName={companyName}
                  referralCode={referralCode}
                />
              </Stack>
            </CodePreviewWrapper>
          </Paper>
        </CustomModal>
      </ReferralShareBox>
    </>
  );
};
export default ReferralShare;
