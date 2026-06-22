import { Box, Typography } from "@mui/material";

export const WEBSITE_TEST_MODE_BANNER_HEIGHT = 28;

export const isWebsiteTestModeEnabled = (configData) =>
  configData?.website_test_mode_status === true ||
  configData?.website_test_mode_status === 1 ||
  configData?.website_test_mode_status === "1";

const WebsiteTestModeBanner = ({ configData }) => {
  if (!isWebsiteTestModeEnabled(configData)) {
    return null;
  }

  const message =
    configData?.website_test_mode_message?.trim() ||
    "ვებგვერდი სატესტო რეჟიმშია!";

  return (
    <Box
      role="status"
      aria-live="polite"
      title={message}
      sx={{
        alignItems: "center",
        backgroundColor: "#fff3cd",
        borderBottom: "1px solid #ffe69c",
        color: "#5f3b00",
        display: "flex",
        height: `${WEBSITE_TEST_MODE_BANNER_HEIGHT}px`,
        justifyContent: "center",
        minHeight: `${WEBSITE_TEST_MODE_BANNER_HEIGHT}px`,
        overflow: "hidden",
        px: 2,
        width: "100%",
      }}
    >
      <Typography
        component="p"
        sx={{
          fontSize: { xs: "12px", sm: "13px" },
          fontWeight: 600,
          lineHeight: 1.2,
          m: 0,
          overflow: "hidden",
          textAlign: "center",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default WebsiteTestModeBanner;
