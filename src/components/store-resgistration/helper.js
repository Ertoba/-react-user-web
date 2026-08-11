export const getZoneWiseModule = (data, zoneId) => {
  const result = data?.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return zoneIds?.includes(zoneId);
  });
  return result;
};

export const REQUIRED_CONTENT_LANGUAGES = [
  { key: "en", value: "English" },
  { key: "ka", value: "ქართული" },
  { key: "ru", value: "Русский" },
];

export const getRequiredContentLanguages = (configuredLanguages = []) => {
  const configuredByKey = new Map(
    configuredLanguages.map((language) => [language?.key, language]),
  );

  return REQUIRED_CONTENT_LANGUAGES.map((requiredLanguage) => ({
    ...requiredLanguage,
    value:
      configuredByKey.get(requiredLanguage.key)?.value || requiredLanguage.value,
  }));
};
