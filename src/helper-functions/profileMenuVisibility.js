import { ModuleTypes } from "./moduleTypes";

export const hasActiveRentalModule = (modules = []) =>
  modules?.some(
    (moduleItem) =>
      moduleItem?.module_type === ModuleTypes.RENTAL &&
      Number(moduleItem?.status ?? 1) !== 0
  );

export const shouldShowProfileMenuItem = (menuItem, configData, modules = []) => {
  if (!menuItem) return false;

  if (
    Number(configData?.customer_wallet_status) === 0 &&
    menuItem?.name === "wallet"
  ) {
    return false;
  }

  if (
    Number(configData?.loyalty_point_status) === 0 &&
    menuItem?.name === "loyalty-points"
  ) {
    return false;
  }

  if (
    Number(configData?.ref_earning_status) === 0 &&
    menuItem?.name === "referral-code"
  ) {
    return false;
  }

  if (menuItem?.id === 3 || menuItem?.name === "my-trips") {
    return hasActiveRentalModule(modules);
  }

  return true;
};
