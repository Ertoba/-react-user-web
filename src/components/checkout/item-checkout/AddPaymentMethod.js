import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Stack, styled } from "@mui/system";
import {
  alpha,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { t } from "i18next";
import { DeliveryCaption } from "../CheckOut.style";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useTheme } from "@emotion/react";
import CustomModal from "../../modal";
import PaymentMethod from "../PaymentMethod";
import { useDispatch } from "react-redux";
import {
  setOfflineInfoStep,
  setOfflineMethod,
} from "../../../redux/slices/offlinePaymentData";
import CloseIcon from "@mui/icons-material/Close";
import wallet from "../assets/wallet.png";
import money from "../assets/money.png";
import OfflinePaymentIcon from "../assets/OfflinePaymentIcon";

const PaymentMethodBox = styled(CustomStackFullWidth)(({ theme }) => ({
  borderRadius: "5px",
  border: "1px solid",
  borderColor: alpha(theme.palette.primary.main, 0.5),
  boxShadow: "px 3px 20px -5px rgba(3, 157, 85, 0.10)",
  padding: "15px",
  alignItems: "center",
  background: theme.palette.neutral[100],
}));

const AddPaymentMethod = (props) => {
  const {
    setPaymentMethod,
    paymentMethod,
    zoneData,
    configData,
    orderType,
    usePartialPayment,
    forprescription,
    offlinePaymentOptions,
    setSwitchToWallet,
    isZoneDigital,
    setPaymentMethodImage,
    paymentMethodImage,
    handlePartialPayment,
    walletBalance,
    removePartialPayment,
    switchToWallet,
    customerData,
    payableAmount,
    changeAmount,
    setChangeAmount,
  } = props;
  const [openModal, setOpenModel] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const digitalPaymentMethods = configData?.active_payment_method_list ?? [];
  const canUseDigitalPayment = Boolean(
    isZoneDigital?.digital_payment &&
      configData?.digital_payment_info?.digital_payment &&
      forprescription !== "true" &&
      digitalPaymentMethods.length
  );
  const canUseCashOnDelivery = Boolean(
    isZoneDigital?.cash_on_delivery && configData?.cash_on_delivery
  );
  const canUseWallet = Boolean(
    configData?.customer_wallet_status === 1 &&
      customerData?.data?.wallet_balance > 0
  );
  const primaryPaymentOptionCount = [
    canUseDigitalPayment,
    canUseCashOnDelivery,
    canUseWallet,
  ].filter(Boolean).length;
  const selectedPrimaryPaymentMethod = digitalPaymentMethods.some(
    (item) => item?.gateway === paymentMethod
  )
    ? "digital_payment"
    : paymentMethod;
  const hasAdditionalPaymentOptions = Boolean(
    digitalPaymentMethods.length > 1 ||
      (configData?.offline_payment_status === 1 &&
        isZoneDigital?.offline_payment &&
        offlinePaymentOptions?.length) ||
      usePartialPayment ||
      switchToWallet ||
      paymentMethod === "cash_on_delivery"
  );

  const handleClick = () => {
    setOpenModel(true);
  };
  const handlePrimaryPaymentChange = (event) => {
    const selectedMethod = event.target.value;

    dispatch(setOfflineMethod(""));
    dispatch(setOfflineInfoStep(0));

    if (selectedMethod === "digital_payment") {
      const digitalMethod = digitalPaymentMethods[0];
      if (!digitalMethod) return;

      setPaymentMethod(digitalMethod.gateway);
      setPaymentMethodImage(digitalMethod.gateway_image_full_url);
      setSwitchToWallet(false);
      return;
    }

    if (selectedMethod === "wallet") {
      handlePartialPayment();
      return;
    }

    setPaymentMethod("cash_on_delivery");
    setPaymentMethodImage(money.src);
    setSwitchToWallet(false);
  };
  useEffect(() => {
    if (paymentMethod?.match("offline_payment")) {
      dispatch(setOfflineInfoStep(1));
      setPaymentMethodImage(OfflinePaymentIcon);
    } else {
      dispatch(setOfflineInfoStep(0));
    }
    if (paymentMethod === "cash_on_delivery") {
      setPaymentMethodImage(money.src);
    } else if (paymentMethod === "wallet") {
      setPaymentMethodImage(wallet.src);
    }
  }, [paymentMethod]);

  return (
    <CustomStackFullWidth spacing={2}>
      <DeliveryCaption const id="demo-row-radio-buttons-group-label">
        {t("Payment Method")}
      </DeliveryCaption>
      <PaymentMethodBox
        direction="row"
        sx={{
          justifyContent: "space-between",
          gap: 1,
          padding: { xs: "10px 12px", md: "15px" },
        }}
      >
        <FormControl fullWidth>
          <RadioGroup
            aria-labelledby="demo-row-radio-buttons-group-label"
            value={selectedPrimaryPaymentMethod}
            onChange={handlePrimaryPaymentChange}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: `repeat(${Math.max(
                  Math.min(primaryPaymentOptionCount, 2),
                  1
                )}, minmax(0, 1fr))`,
                sm: `repeat(${Math.max(
                  primaryPaymentOptionCount,
                  1
                )}, minmax(0, 1fr))`,
              },
              width: "100%",
            }}
          >
            {canUseDigitalPayment && (
              <FormControlLabel
                value="digital_payment"
                control={<Radio size="small" />}
                label={
                  <Typography fontSize="12px" fontWeight="600" noWrap>
                    {t("Digital Payment")}
                  </Typography>
                }
                sx={{ margin: 0, minWidth: 0 }}
              />
            )}
            {canUseCashOnDelivery && (
              <FormControlLabel
                value="cash_on_delivery"
                control={<Radio size="small" />}
                label={
                  <Typography fontSize="12px" fontWeight="600" noWrap>
                    {t("Cash On Delivery")}
                  </Typography>
                }
                sx={{ margin: 0, minWidth: 0 }}
              />
            )}
            {canUseWallet && (
              <FormControlLabel
                value="wallet"
                control={<Radio size="small" />}
                label={
                  <Typography fontSize="12px" fontWeight="600" noWrap>
                    {t("Wallet")}
                  </Typography>
                }
                sx={{ margin: 0, minWidth: 0 }}
              />
            )}
          </RadioGroup>
        </FormControl>
        {hasAdditionalPaymentOptions && (
          <Tooltip
            arrow
            placement="top"
            TransitionComponent={Zoom}
            title={t("Payment Methods")}
          >
            <IconButton onClick={handleClick} size="small" color="primary">
              <BorderColorIcon sx={{ width: "18px", height: "18px" }} />
            </IconButton>
          </Tooltip>
        )}
      </PaymentMethodBox>
      {openModal && (
        <CustomModal
          openModal={openModal}
          handleClose={() => setOpenModel(false)}
          minWidth="300px"
          maxWidth="660px"
        >
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ position: "relative" }}
          >
            <IconButton
              onClick={() => setOpenModel(false)}
              sx={{
                zIndex: "99",
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: (theme) => theme.palette.neutral[100],
                borderRadius: "50%",
                [theme.breakpoints.down("md")]: {
                  top: 10,
                  right: 5,
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "16px", fontWeight: "500" }} />
            </IconButton>
          </CustomStackFullWidth>
          <PaymentMethod
            setPaymentMethod={setPaymentMethod}
            paymentMethod={paymentMethod}
            zoneData={zoneData}
            configData={configData}
            orderType={orderType}
            usePartialPayment={usePartialPayment}
            setOpenModel={setOpenModel}
            forprescription={forprescription}
            offlinePaymentOptions={offlinePaymentOptions}
            paymentMethodImage={paymentMethodImage}
            setPaymentMethodImage={setPaymentMethodImage}
            setSwitchToWallet={setSwitchToWallet}
            isZoneDigital={isZoneDigital}
            handlePartialPayment={handlePartialPayment}
            walletBalance={walletBalance}
            removePartialPayment={removePartialPayment}
            switchToWallet={switchToWallet}
            customerData={customerData}
            payableAmount={payableAmount}
            changeAmount={changeAmount}
            setChangeAmount={setChangeAmount}
          />
        </CustomModal>
      )}
    </CustomStackFullWidth>
  );
};

export default AddPaymentMethod;
