// Pharmacy items may omit generic_name or return it as a string rather
// than an array. Rendering an undefined array entry throws in list view.
export const getGenericNameText = (genericName) => {
  const first = Array.isArray(genericName) ? genericName[0] : genericName;
  return typeof first === "string" || typeof first === "number"
    ? String(first)
    : "";
};
