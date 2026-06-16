import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getModule } from "helper-functions/getLanguage";
import { ModuleTypes } from "helper-functions/moduleTypes";

const normalize = (value) => String(value || "").trim().toLowerCase();

export const isBeerModule = (module = getModule()) => {
  const moduleType = normalize(module?.module_type || module?.moduleType);
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

export const getStoreTerminologyKey = () => {
  if (isBeerModule()) {
    return "Bars";
  }

  const moduleType = getCurrentModuleType();

  if (moduleType === ModuleTypes.FOOD) {
    return "Restaurants";
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

export const getStoreTerminology = () => t(getStoreTerminologyKey());

export const getItemTerminology = () => t(getItemTerminologyKey());
