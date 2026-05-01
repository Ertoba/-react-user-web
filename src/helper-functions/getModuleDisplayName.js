const moduleTypeTranslationKey = {
  food: "Food",
  grocery: "Grocery",
  pharmacy: "Pharmacy",
  ecommerce: "Ecommerce",
  parcel: "Parcel",
  rental: "Rental",
};

export const getModuleDisplayName = (item, t) => {
  const rawName = String(item?.module_name || "").trim();
  const cleanedName = rawName.replace(/^messages[._-]?/i, "").trim();
  const fallbackKey = moduleTypeTranslationKey[item?.module_type];

  if (!cleanedName || /^messages[._-]?/i.test(rawName)) {
    return fallbackKey ? t(fallbackKey) : cleanedName || rawName;
  }

  return t(cleanedName);
};
