import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const VerifiedStoreBadge = ({ verified, fontSize = 16, sx }) => {
  const { t } = useTranslation();

  if (!verified) {
    return null;
  }

  const label =
    getCurrentModuleType() === ModuleTypes.FOOD
      ? t("Verified Restaurant")
      : t("Verified Store");

  return (
    <Tooltip title={label} arrow>
      <Box
        component="span"
        role="img"
        aria-label={label}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginInlineStart: "4px",
          lineHeight: 1,
          verticalAlign: "middle",
          ...sx,
        }}
      >
        <VerifiedIcon sx={{ color: "#3979E0", fontSize }} />
      </Box>
    </Tooltip>
  );
};

export default VerifiedStoreBadge;
