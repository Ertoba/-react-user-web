const GEORGIAN_LOCALE = "ka-GE";

export const toGeorgianUpper = (value) => {
  if (typeof value !== "string") return value;
  return value.toLocaleUpperCase(GEORGIAN_LOCALE);
};

export const formatStoreName = (value) => toGeorgianUpper(value);

export const formatProductName = (value) => toGeorgianUpper(value);

export const formatCategoryName = (value) => toGeorgianUpper(value);

export const georgianCapsFontFamily =
  '"BPG SSP Crystal Caps", "BPG SSP Crystal", "Rubik", sans-serif';
