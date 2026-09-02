import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getModule } from "helper-functions/getLanguage";
import { ModuleTypes } from "helper-functions/moduleTypes";

const normalize = (value) => String(value || "").trim().toLowerCase();

const getModuleType = (module = getModule()) =>
  normalize(module?.module_type || module?.moduleType || getCurrentModuleType());

export const isBeerModule = (module = getModule()) => {
  const moduleType = getModuleType(module);
  const slug = normalize(module?.slug || module?.module_slug);
  const name = normalize(
    module?.module_name || module?.moduleName || module?.name
  );

  return (
    moduleType === ModuleTypes.FOOD &&
    (slug === "ludi" ||
      slug === "beer" ||
      name === "\u10da\u10e3\u10d3\u10d8" ||
      name === "beer")
  );
};

export const isPharmacyModule = (module = getModule()) =>
  getModuleType(module) === ModuleTypes.PHARMACY;

export const isRestaurantModule = (module = getModule()) =>
  getModuleType(module) === ModuleTypes.FOOD && !isBeerModule(module);

export const getStoreTerminologyKey = (module = getModule()) => {
  if (isBeerModule(module)) {
    return "Bars";
  }

  const moduleType = getModuleType(module);

  if (moduleType === ModuleTypes.FOOD) {
    return "Restaurants";
  }
  if (moduleType === ModuleTypes.PHARMACY) {
    return "Pharmacies";
  }
  if (moduleType === ModuleTypes.RENTAL) {
    return "Providers";
  }

  return "Stores";
};

export const getItemTerminologyKey = () => {
  if (isBeerModule()) {
    return "Beer";
  }

  const moduleType = getCurrentModuleType();

  if (moduleType === ModuleTypes.FOOD) {
    return "foods";
  }
  if (moduleType === ModuleTypes.RENTAL) {
    return "Vehicles";
  }

  return "items";
};

export const getRecommendedStoreTitleKey = (module = getModule()) => {
  if (isBeerModule(module)) return "Recommended Bar";
  if (isPharmacyModule(module)) return "Recommended Pharmacy";
  if (isRestaurantModule(module)) return "Recommended Restaurant";
  return "Recommended Store";
};

export const getRecentPurchasePromptKey = (module = getModule()) => {
  if (isBeerModule(module)) return "Order from the bar where you last ordered";
  if (isPharmacyModule(module)) {
    return "Order from the pharmacy where you last ordered";
  }
  if (isRestaurantModule(module)) {
    return "Order from the restaurant where you last ordered";
  }
  return "Get your recent purchase from the shop you recently ordered";
};

export const getBestNearbyStoreTitleKey = (module = getModule()) => {
  if (isBeerModule(module)) return "Best Bar Nearby";
  if (isPharmacyModule(module)) return "Best Pharmacy Nearby";
  if (isRestaurantModule(module)) return "Best Restaurant Nearby";
  return "Best Store Nearby";
};

export const getFeaturedStoreTitleKey = (module = getModule()) =>
  isPharmacyModule(module) ? "Featured Pharmacies" : "Featured Store";

export const getStoreSearchPlaceholderKey = (module = getModule()) => {
  if (isBeerModule(module)) return "Search for bars...";
  if (isPharmacyModule(module)) return "Search for medicines or pharmacies...";
  if (isRestaurantModule(module)) return "Search for restaurants...";
  return "Search for stores...";
};

export const getNoStoreAvailableKey = (module = getModule()) => {
  if (isBeerModule(module)) return "Bars not found!";
  if (isPharmacyModule(module)) return "Pharmacies not found!";
  if (isRestaurantModule(module)) return "Restaurants not found!";
  return "Stores not found!";
};

export const getStoreTerminology = (module) =>
  t(getStoreTerminologyKey(module));

export const getItemTerminology = () => t(getItemTerminologyKey());
