import React, { useEffect, useRef, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Box, Stack, Typography, alpha, styled } from "@mui/material";
import StoreMessageSvg from "./assets/store_message.svg";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { georgianCapsFontFamily, toGeorgianUpper } from "utils/georgianText";

const BgBox = styled(Box)(({ theme, src }) => ({
  backgroundImage: `url(${src})`,
  backgroundPosition: "center",
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  borderRadius: "8px",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  border: `1px solid ${theme.palette.secondary.main}`,
  display: "flex",
  alignItems: "center",
}));

const StoreCustomMessage = ({ storeAnnouncement }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [animation, setAnimation] = useState({
    shouldAnimate: false,
    duration: 8,
  });
  const announcementText = toGeorgianUpper(storeAnnouncement || "");

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content || !announcementText) {
      setAnimation({ shouldAnimate: false, duration: 8 });
      return undefined;
    }

    const measure = () => {
      const availableWidth = Math.max(container.clientWidth - 24, 0);
      const contentWidth = content.scrollWidth;
      setAnimation({
        shouldAnimate: contentWidth > availableWidth,
        duration: Math.max(8, contentWidth / 40),
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, [announcementText]);

  if (!announcementText) {
    return null;
  }

  return (
    <CustomStackFullWidth paddingBlock="10px">
      <BgBox src={StoreMessageSvg.src}>
        <Box
          ref={containerRef}
          sx={{
            height: { xs: 54, sm: 60 },
            position: "relative",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Stack
            ref={contentRef}
            direction="row"
            spacing={{ xs: 1, sm: 1.5 }}
            alignItems="center"
            sx={{
              position: "absolute",
              top: "50%",
              left: animation.shouldAnimate ? "100%" : "50%",
              width: "max-content",
              maxWidth: "none",
              whiteSpace: "nowrap",
              transform: animation.shouldAnimate
                ? "translateY(-50%)"
                : "translate(-50%, -50%)",
              animation: animation.shouldAnimate
                ? "storeAnnouncementScroll " + animation.duration + "s linear infinite"
                : "none",
              px: 1.5,
              "@keyframes storeAnnouncementScroll": {
                "0%": {
                  transform: "translate(0, -50%)",
                },
                "100%": {
                  transform: "translate(-200%, -50%)",
                },
              },
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
                left: 1.5,
                right: 1.5,
                width: "auto",
                whiteSpace: "normal",
                transform: "translateY(-50%)",
                justifyContent: "center",
              },
            }}
          >
            <CampaignIcon
              color="primary"
              sx={{
                width: { xs: 24, sm: 30 },
                height: { xs: 24, sm: 30 },
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "13px", sm: "16px" },
                lineHeight: 1.35,
                fontWeight: 500,
                fontFamily: georgianCapsFontFamily,
                letterSpacing: 0,
              }}
            >
              {announcementText}
            </Typography>
          </Stack>
        </Box>
      </BgBox>
    </CustomStackFullWidth>
  );
};

export default StoreCustomMessage;
