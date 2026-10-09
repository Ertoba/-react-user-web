import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { t } from "i18next";
import ThemeSwitches from "components/header/top-navbar/ThemeSwitches";
import CustomLanguage from "components/header/top-navbar/language/CustomLanguage";
import CustomModal from "components/modal";
import DeleteAccount from "components/user-information/DeleteAccount";
import { useSettings } from "contexts/use-settings";

// V4.2 settings row, using MILI's existing controls and theme.
const SettingRow = ({ label, value, action, danger = false }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    gap="16px"
    sx={{ py: "20px", px: { xs: "12px", sm: "24px" } }}
  >
    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: 600,
          color: danger ? "error.main" : "neutral.1050",
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
      {value && (
        <Typography
          sx={{ fontSize: "13px", color: "neutral.500", lineHeight: 1.4 }}
        >
          {value}
        </Typography>
      )}
    </Stack>
    {action}
  </Stack>
);

const SettingsSection = ({ children }) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: "12px",
      overflow: "hidden",
      "& > *:not(:last-child)": {
        borderBottom: "1px solid",
        borderColor: "divider",
      },
    }}
  >
    {children}
  </Box>
);

const CustomSettings = ({
  deleteUserHandler,
  accountDeleteStatus,
  setAccountDeleteStatus,
  isLoadingDelete,
}) => {
  const { countryCode, language } = useSelector(
    (state) => state.configData,
  );
  const { settings } = useSettings();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setAccountDeleteStatus?.(true);
  };

  return (
    <Box sx={{ py: "24px", px: { xs: "4px", md: "24px" } }}>
      <SettingsSection>
        <SettingRow
          label={t("Theme")}
          value={settings?.theme === "dark" ? t("Dark Mode") : t("Light Mode")}
          action={<ThemeSwitches noText />}
        />
        <SettingRow
          label={t("Language")}
          value={language || t("Default")}
          action={
            <CustomLanguage countryCode={countryCode} language={language} />
          }
        />
        {typeof deleteUserHandler === "function" && (
          <SettingRow
            label={t("Delete your account")}
            value={t("Deleting your account will remove all your orders, addresses, wallet balance and personal data permanently.")}
            danger
            action={
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => setDeleteModalOpen(true)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {t("Delete Account")}
              </Button>
            }
          />
        )}
      </SettingsSection>
      {typeof deleteUserHandler === "function" && (
        <CustomModal
          openModal={deleteModalOpen}
          handleClose={closeDeleteModal}
        >
          <DeleteAccount
            deleteUserHandler={deleteUserHandler}
            accountDeleteStatus={accountDeleteStatus}
            isLoading={isLoadingDelete}
            handleClose={closeDeleteModal}
          />
        </CustomModal>
      )}
    </Box>
  );
};

export default CustomSettings;
