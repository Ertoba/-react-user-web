import React from "react";
import { Stack } from "@mui/system";
import { PrimaryButton } from "../Map/map.style";
import { useTranslation } from "react-i18next";

const WishListSideBarAction = () => {
  const { t } = useTranslation();
  return (
    <Stack direction="row" width="100%" spacing={1} pb="1rem">
      <PrimaryButton
        variant="contained"
        size="large"
        fullWidth
        borderRadius="7px"
      >
        {t("Add All to Cart")}
      </PrimaryButton>
    </Stack>
  );
};

export default WishListSideBarAction;
