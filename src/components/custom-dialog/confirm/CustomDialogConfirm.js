import React from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import { Stack } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import {
  CustomButtonCancel,
  CustomButtonSuccess,
} from "styled-components/CustomButtons.style";
import { WrapperForCustomDialogConfirm } from "./CustomDialogConfirm.style";

const CustomDialogConfirmStyle = (props) => {
  const { open, onClose, onSuccess, dialogTexts, isLoading } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          width: { xs: "calc(100% - 40px)", sm: "560px" },
          maxWidth: "560px",
          m: "20px",
          borderRadius: "20px",
          overflow: "hidden",
        },
      }}
    >
      <WrapperForCustomDialogConfirm
        sx={{
          width: "100% !important",
          boxShadow: "none",
          borderRadius: 0,
          px: { xs: "20px", sm: "24px" },
          pt: { xs: "28px", sm: "30px" },
          pb: { xs: "20px", sm: "24px" },
        }}
      >
        <Stack alignItems="center" justifyContent="center">
          <DialogTitle id="alert-dialog-title" sx={{ p: 0, pb: "22px" }}>
            <Typography
              textAlign="center"
              sx={{
                fontSize: { xs: "18px", sm: "20px" },
                fontWeight: 700,
                lineHeight: 1.25,
                color: "text.primary",
              }}
            >
              {dialogTexts ? t(dialogTexts) : t("Confirm this request?")}
            </Typography>
          </DialogTitle>
        </Stack>

        <DialogActions sx={{ p: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            width="100%"
            gap={{ xs: "10px", sm: "12px" }}
          >
            <CustomButtonSuccess
              loading={isLoading}
              variant="contained"
              onClick={onSuccess}
              sx={{
                flex: 1,
                width: "100% !important",
                height: "48px",
                borderRadius: "10px",
                boxShadow: "none",
              }}
            >
              {t("Yes")}
            </CustomButtonSuccess>
            <CustomButtonCancel
              variant="contained"
              onClick={onClose}
              sx={{
                flex: 1,
                width: "100% !important",
                height: "48px",
                borderRadius: "10px",
                boxShadow: "none",
              }}
            >
              {t("Cancel")}
            </CustomButtonCancel>
          </Stack>
        </DialogActions>
      </WrapperForCustomDialogConfirm>
    </Dialog>
  );
};

export default CustomDialogConfirmStyle;
