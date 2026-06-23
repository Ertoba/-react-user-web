import { ModuleTypes } from "./moduleTypes";

export const hasActiveRentalModule = (modules = []) =>
  modules?.some(
    (moduleItem) =>
      moduleItem?.module_type === ModuleTypes.RENTAL &&
      Number(moduleItem?.status ?? 1) !== 0
  );

export const shouldShowProfileMenuItem = (menuItem, configData, modules = []) => {
  if (!menuItem) return false;

  if (configData?.customer_wallet_status === 0 && menuItem?.id === 4) {
    return false;
  }

  if (configData?.loyalty_point_status === 0 && menuItem?.id === 5) {
    return false;
  }

  if (configData?.ref_earning_status === 0 && menuItem?.id === 6) {
    return false;
  }

  if (menuItem?.id === 3 || menuItem?.name === "my-trips") {
    return hasActiveRentalModule(modules);
  }

  return true;
};
