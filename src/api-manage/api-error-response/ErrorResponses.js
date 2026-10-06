import toast from "react-hot-toast";
import { t } from "i18next";
import Router from "next/router";

export const handleTokenExpire = (item, status) => {
  if (status === 401) {
    if (window.localStorage.getItem("token")) {
      toast.error(t("Your account is inactive or Your token has been expired"));
      window?.localStorage.removeItem("token");
      Router.push("/home", undefined, { shallow: true });
    }
  } else {
    toast.error(t(item?.message), {
      id: "error",
    });
  }
};

export const onErrorResponse = (error) => {
  const status = error?.response?.status;

  if (status === 401) {
    handleTokenExpire(error, status);
    return;
  }

  const errors = error?.response?.data?.errors;

  if (Array.isArray(errors)) {
    errors.forEach((item) => {
      handleTokenExpire(item, status);
    });
  } else if (errors && typeof errors === "object") {
    const messages = Object.values(errors).flat().filter(Boolean);

    if (messages.length > 0) {
      messages.forEach((message) =>
        handleTokenExpire({ message }, status)
      );
    } else {
      handleTokenExpire({ message: errors?.message }, status);
    }
  } else if (errors) {
    handleTokenExpire(
      { message: typeof errors === "string" ? errors : undefined },
      status
    );
  }
};

export const onSingleErrorResponse = (error) => {
  const status = error?.response?.status;
  const errors = error?.response?.data?.errors;

  if (
    (Array.isArray(errors) && errors.length > 0) ||
    (errors && typeof errors === "object")
  ) {
    return onErrorResponse(error);
  }

  if (status === 401) {
    handleTokenExpire(error, status);
    return;
  }

  const message =
    error?.response?.data?.message ||
    (typeof errors === "string" ? errors : undefined) ||
    error?.message;

  toast.error(t(message), {
    id: "error",
  });
};