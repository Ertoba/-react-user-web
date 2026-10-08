import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useGetGroupedCart from "../../api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { CustomDateFormat } from "../date-and-time-formators/CustomDateFormat";
import AccountMenuPanel from "../header/second-navbar/account-popover/AccountMenuPanel";

const MobileProfileOverview = ({ data, isLoading, configData, token }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { refetch: cartListRefetch } = useGetGroupedCart();

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : null;

  const goHome = () => {
    router.push({
      pathname: "/home",
      query: moduleParam ? { module: moduleParam } : undefined,
    });
  };

  const openEdit = () => {
    router.push({
      pathname: "/profile",
      query: {
        ...(moduleParam ? { module: moduleParam } : {}),
        page: "profile-settings",
      },
    });
  };

  const walletEnabled = Number(configData?.customer_wallet_status ?? 1) !== 0;
  const loyaltyEnabled = Number(configData?.loyalty_point_status ?? 1) !== 0;

  const stats = [
    walletEnabled && {
      key: "wallet",
      label: "Wallet",
      value: getAmountWithSign(data?.wallet_balance ?? 0),
      icon: "fi fi-rr-wallet",
    },
    loyaltyEnabled && {
      key: "loyalty",
      label: "Loyalty Points",
      value: data?.loyalty_point ?? 0,
      icon: "fi fi-rr-badge",
    },
  ].filter(Boolean);

  const displayName = [data?.f_name, data?.l_name].filter(Boolean).join(" ");

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundColor: "background.default",
        pb: "84px",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1090,
          backgroundColor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          pt: "env(safe-area-inset-top)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ minHeight: "64px", px: "16px" }}
        >
          <IconButton
            onClick={goHome}
            aria-label={t("Back")}
            sx={{
              width: 40,
              height: 40,
              color: "text.primary",
              flexShrink: 0,
            }}
          >
            <i
              className="fi fi-rr-arrow-small-left"
              style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
            />
          </IconButton>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.6px",
            }}
          >
            {t("Profile")}
          </Typography>
        </Stack>
      </Box>

      <Stack gap="16px" sx={{ px: "16px", pt: "24px" }}>
        <Box
          sx={{
            position: "relative",
            backgroundColor: "background.secondary",
            borderRadius: "16px",
            px: "16px",
            pt: "16px",
            pb: "20px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box
              onClick={openEdit}
              role="button"
              tabIndex={0}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "primary.main",
                cursor: "pointer",
                px: "4px",
                py: "4px",
              }}
            >
              <i
                className="fi fi-rr-pencil"
                style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "inherit",
                  lineHeight: 1.1,
                }}
              >
                {t("Edit")}
              </Typography>
            </Box>
          </Box>

          <Stack alignItems="center" sx={{ mt: "-4px" }}>
            {isLoading ? (
              <Skeleton variant="circular" width={72} height={72} />
            ) : (
              <Avatar
                src={data?.image_full_url || undefined}
                alt={displayName || t("Profile")}
                sx={{
                  width: 72,
                  height: 72,
                  backgroundColor: "transparent",
                  color: "neutral.500",
                  border: `2px solid ${theme.palette.divider}`,
                  "& .MuiAvatar-img": { objectFit: "cover" },
                }}
              >
                <i
                  className="fi fi-rr-circle-user"
                  style={{ fontSize: "40px", lineHeight: 1, display: "flex" }}
                />
              </Avatar>
            )}

            {isLoading ? (
              <Skeleton width={120} height={34} sx={{ mt: "8px" }} />
            ) : (
              <Typography
                sx={{
                  mt: "10px",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.15,
                  textAlign: "center",
                }}
              >
                {displayName || t("User")}
              </Typography>
            )}

            <Stack
              direction="row"
              alignItems="center"
              gap="6px"
              sx={{ mt: "6px", color: "neutral.500" }}
            >
              <i
                className="fi fi-rr-calendar"
                style={{ fontSize: "15px", lineHeight: 1, display: "flex" }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "neutral.500",
                  lineHeight: 1.2,
                }}
              >
                {t("Join")}{" "}
                {data?.created_at ? CustomDateFormat(data.created_at) : ""}
              </Typography>
            </Stack>
          </Stack>

          {stats.length > 0 && (
            <Stack direction="row" gap="12px" sx={{ mt: "24px" }}>
              {stats.map((stat) => (
                <Box
                  key={stat.key}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: "112px",
                    backgroundColor: "background.paper",
                    borderRadius: "12px",
                    p: "16px",
                    position: "relative",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "neutral.1050",
                      lineHeight: 1.1,
                      pr: "28px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {isLoading ? <Skeleton width={60} /> : stat.value}
                  </Typography>

                  <Box
                    sx={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      color: "primary.main",
                    }}
                  >
                    <i
                      className={stat.icon}
                      style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      mt: "18px",
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "neutral.500",
                      lineHeight: 1.15,
                    }}
                  >
                    {t(stat.label)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        <AccountMenuPanel
          bg="gray"
          token={token}
          cartListRefetch={cartListRefetch}
        />
      </Stack>
    </Box>
  );
};

export default MobileProfileOverview;
