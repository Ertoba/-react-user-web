import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import useGetGroupedCart from "../../api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import AccountMenuPanel from "./second-navbar/account-popover/AccountMenuPanel";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";

const ProfileDrawer = ({ open, onClose, onSignInClick }) => {
  const theme = useTheme();
  const router = useRouter();
  const profileInfo = useSelector((state) => state.profileInfo?.profileInfo);
  const displayName = [profileInfo?.f_name, profileInfo?.l_name]
    .filter(Boolean)
    .join(" ");
  const { refetch: cartListRefetch } = useGetGroupedCart();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "100%",
          height: "90vh",
          backgroundColor: "background.default",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          px: "12px",
          pt: "6px",
          pb: "6px",
          backgroundColor: "background.default",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label={t("Close")}
          sx={{ p: "6px", color: "text.primary" }}
        >
          <i
            className="fi fi-rr-cross-small"
            style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
      </Stack>
      {/* Header */}
      {/* <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{
          px: "16px",
          py: "12px",
          height: "56px",
          backgroundColor: "background.default",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ p: "4px", color: "text.primary" }}
          aria-label={token ? t("Back") : t("Close")}
        >
          <i
            className={token ? "fi fi-rr-arrow-small-left" : "fi fi-rr-circle-xmark"}
            style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
          }}
        >
          {t("Profile")}
        </Typography>
      </Stack> */}

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "background.default",
          px: "16px",
          py: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Signed-in profile card, separate from the guest login experience. */}
        {token && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              backgroundColor: "background.secondary",
              borderRadius: "16px",
              px: "16px",
              py: "20px",
            }}
          >
            <Avatar
              src={profileInfo?.image_full_url || undefined}
              alt={displayName || t("Profile")}
              sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
            >
              {displayName?.charAt(0)?.toUpperCase() || "?"}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{ fontWeight: 700, fontSize: "18px", color: "text.primary" }}
                noWrap
              >
                {displayName || t("Your Profile")}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "text.secondary" }} noWrap>
                {profileInfo?.phone || profileInfo?.email || ""}
              </Typography>
            </Box>
            <CustomButtonPrimary
              variant="outlined"
              onClick={() => {
                onClose?.();
                router.push({ pathname: "/profile", query: { page: "profile-settings" } });
              }}
              sx={{ flexShrink: 0, minWidth: 64, borderRadius: "10px", px: 1.5 }}
            >
              {t("Edit")}
            </CustomButtonPrimary>
          </Stack>
        )}

        {/* Guests only: login/signup intro card. */}
        {!token && (
        <Box
          sx={{
            backgroundColor: "background.secondary",
            borderRadius: "16px",
            pt: "24px",
            pb: "32px",
            px: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Stack spacing="6px" sx={{ width: "100%", px: "16px" }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.6px",
                textAlign: "center",
              }}
            >
              {t("Login or Signup")}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
                textAlign: "center",
              }}
            >
              {t(
                "To get more personalised & smooth experience please log in or sign up"
              )}
            </Typography>
          </Stack>
          <CustomButtonPrimary
            variant="contained"
            onClick={() => {
              onClose?.();
              onSignInClick?.();
            }}
            sx={{
              height: "40px",
              px: "16px",
              borderRadius: "12px",
              textTransform: "capitalize",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.48px",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {t("Login/Signup")}
          </CustomButtonPrimary>
        </Box>
        )}

        {/* Menu panel */}
        <AccountMenuPanel
          bg="gray"
          token={token}
          onClose={onClose}
          onSignInClick={onSignInClick}
          cartListRefetch={cartListRefetch}
          hideLoginButton
        />
      </Box>
    </Drawer>
  );
};

export default ProfileDrawer;
