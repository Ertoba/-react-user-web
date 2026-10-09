/**
 * Checkout payment options must come from the backend's active gateway catalog.
 * A global digital-payment toggle alone does not mean a gateway is configured.
 */
export const isDigitalPaymentEnabled = (configData) =>
  Boolean(configData?.digital_payment && configData?.digital_payment_info?.digital_payment);

export const getActivePaymentGatewayOptions = (configData) => {
  if (!isDigitalPaymentEnabled(configData)) return [];
  const methods = configData?.active_payment_method_list;
  if (!Array.isArray(methods)) return [];
  return methods.filter(
    (item) => typeof item?.gateway === "string" && item.gateway.trim().length > 0,
  );
};
