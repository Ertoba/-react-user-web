import i18n from "i18next";
import toast from "react-hot-toast";

const normalizeMessage = (message) =>
  String(message || "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/[.!]+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

const serverMessageKeys = {
  "order cancelled succesfully": "Order canceled successfully",
  "order cancelled successfully": "Order canceled successfully",
  "order canceled successfully": "Order canceled successfully",
  unauthenticated: "Unauthenticated.",
  "successfully added": "Successfully added",
  "successfully removed": "Successfully removed",
  "address deleted successfully": "Address deleted successfully.",
  "item already exists": "Item already exists",
  "cart item remove successfully": "Cart item remove successfully",
  "updated successfully": "Updated successfully.",
  "payment info updated": "Payment info updated.",
  "coupon applied": "Coupon Applied",
  "order is successful placed": "Order is successful placed",
  "review submited successfully": "Review submited successfully",
  "review submitted successfully": "Review submited successfully",
};

const resolveMessageKey = (message) => {
  const normalized = normalizeMessage(message);

  if (!normalized) {
    return message;
  }

  if (serverMessageKeys[normalized]) {
    return serverMessageKeys[normalized];
  }

  if (normalized.endsWith(" is closed try again later")) {
    return normalized.includes("restaurant")
      ? "Restaurant is closed. Try again later."
      : "Store is closed. Try again later.";
  }

  return message;
};

export const translateServerMessage = (message) => {
  if (typeof message !== "string") {
    return message;
  }

  const key = resolveMessageKey(message);
  return i18n.t(key);
};

let toastTranslatorInstalled = false;

export const installTranslatedToast = () => {
  if (toastTranslatorInstalled) {
    return;
  }

  const originalSuccess = toast.success.bind(toast);
  const originalError = toast.error.bind(toast);

  toast.success = (message, options) =>
    originalSuccess(translateServerMessage(message), options);
  toast.error = (message, options) =>
    originalError(translateServerMessage(message), options);

  toastTranslatorInstalled = true;
};
