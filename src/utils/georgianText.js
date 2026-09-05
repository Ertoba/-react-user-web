import { miliCapsFontFamily } from "../theme/typography.js";

const GEORGIAN_LOCALE = "ka-GE";

export const toGeorgianUpper = (value) => {
  if (typeof value !== "string") return value;
  return value.toLocaleUpperCase(GEORGIAN_LOCALE);
};

// Names retain their authored case; only category labels opt into CAPS.
export const formatStoreName = (value) => value;

export const formatProductName = (value) => value;

export const formatCategoryName = (value) => toGeorgianUpper(value);

export const georgianCapsFontFamily = miliCapsFontFamily;
