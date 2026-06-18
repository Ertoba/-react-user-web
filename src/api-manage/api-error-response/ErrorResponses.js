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
  if (error?.response?.status === 401) {
    handleTokenExpire(error, error?.response?.status);
    return;
  }

  error?.response?.data?.errors?.forEach((item) => {
    handleTokenExpire(item, error?.response?.status);
  });
};
export const onSingleErrorResponse = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.message ||
    error?.message;

  toast.error(t(message), {
    id: "error",
  });
  handleTokenExpire(error, error?.response?.status);
};
