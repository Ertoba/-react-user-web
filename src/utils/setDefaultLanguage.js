import cookie from "js-cookie";

export const setDefaultLanguage = () => {
  const lan = "ka";
  const country = "GE";
  cookie.set("languageSetting", lan);
  localStorage.setItem("language-setting", JSON.stringify(lan));
  localStorage.setItem("country", JSON.stringify(country));
};
