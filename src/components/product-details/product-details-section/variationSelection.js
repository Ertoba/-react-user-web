const normalizeTitle = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-./]+/g, "");

const normalizeVariationPart = (value) =>
  String(value || "").trim().toLowerCase().replace(/\s+/g, "");

const normalizeVariationType = (value) =>
  String(value || "").trim().toLowerCase().replace(/\s+/g, "");

export const isTechnicalBrandTitle = (value) => {
  const normalized = normalizeTitle(value);
  return ["brand", "\u10d1\u10e0\u10d4\u10dc\u10d3\u10d8", "\u0431\u0440\u0435\u043d\u0434"].includes(normalized);
};

export const isTechnicalModelTitle = (value) => {
  const normalized = normalizeTitle(value);
  return [
    "model",
    "\u10db\u10dd\u10d3\u10d4\u10da\u10d8",
    "\u043c\u043e\u0434\u0435\u043b\u044c",
    "applicablemodel",
    "compatiblemodel",
    "\u10e2\u10d4\u10da\u10d4\u10e4\u10dd\u10dc\u10d8\u10e1\u10db\u10dd\u10d3\u10d4\u10da\u10d8",
  ].includes(normalized);
};

export const inferTechnicalBrandKey = (value) => {
  const lower = String(value || "").trim().toLowerCase();
  const compact = lower.replace(/[\s_\-./]+/g, "");

  if (
    lower.includes("iphone") ||
    lower.includes("\u10d0\u10d8\u10e4\u10dd\u10dc") ||
    lower.includes("\u0430\u0439\u0444\u043e\u043d") ||
    lower.includes("apple") ||
    /^(1[1-7])(pro|max|promax|plus|mini|air)?$/.test(compact)
  ) {
    return "iphone";
  }
  if (
    lower.includes("samsung") ||
    lower.includes("\u10e1\u10d0\u10db\u10e1\u10e3\u10dc\u10d2") ||
    lower.includes("\u0441\u0430\u043c\u0441\u0443\u043d\u0433") ||
    lower.includes("galaxy") ||
    lower.includes("\u10d2\u10d0\u10da\u10d0\u10e5\u10e1\u10d8") ||
    lower.includes("\u0433\u0430\u043b\u0430\u043a\u0441\u0438") ||
    /^(a|m|s|f)\s?\d{2,3}\b/.test(lower)
  ) {
    return "samsung";
  }
  if (
    lower.includes("redmi") ||
    lower.includes("\u10e0\u10d4\u10d3\u10db\u10d8") ||
    lower.includes("\u0440\u0435\u0434\u043c\u0438")
  ) {
    return "redmi";
  }
  if (lower.includes("poco") || lower.includes("\u10de\u10dd\u10d9\u10dd")) {
    return "poco";
  }
  if (
    lower.includes("xiaomi") ||
    lower.includes("\u10e8\u10d0\u10dd\u10db\u10d8") ||
    lower.includes("\u0441\u044f\u043e\u043c\u0438")
  ) {
    return "xiaomi";
  }
  if (lower.includes("honor") || lower.includes("\u10f0\u10dd\u10dc\u10dd\u10e0")) {
    return "honor";
  }
  if (lower.includes("huawei") || lower.includes("\u10f0\u10e3\u10d0\u10d5\u10d4\u10d8")) {
    return "huawei";
  }
  if (lower.includes("oppo")) return "oppo";
  if (lower.includes("realme")) return "realme";
  if (lower.includes("oneplus")) return "oneplus";
  if (lower.includes("pixel") || lower.includes("googlepixel")) return "pixel";
  if (/^(a|m|s|f)\d{2,3}[a-z]*$/.test(compact)) return "samsung";

  return null;
};

const brandOrder = (key) => {
  const keys = [
    "iphone",
    "samsung",
    "redmi",
    "xiaomi",
    "poco",
    "honor",
    "huawei",
    "oppo",
    "realme",
    "oneplus",
    "pixel",
  ];
  const index = keys.indexOf(key);
  return index === -1 ? keys.length : index;
};

export const technicalBrandLabel = (key) => {
  const labels = {
    iphone: "iPhone",
    samsung: "Samsung",
    redmi: "Redmi",
    xiaomi: "Xiaomi",
    poco: "POCO",
    honor: "Honor",
    huawei: "Huawei",
    oppo: "OPPO",
    realme: "realme",
    oneplus: "OnePlus",
    pixel: "Pixel",
  };
  return labels[key] || key || "Other";
};

export const sortTechnicalModels = (options) =>
  [...(options || [])].sort((left, right) => {
    const brandDifference =
      brandOrder(inferTechnicalBrandKey(left)) -
      brandOrder(inferTechnicalBrandKey(right));
    return brandDifference || String(left).localeCompare(String(right));
  });

export const legacyBrandForTechnicalModel = (model, brandOptions) => {
  const options = brandOptions || [];
  if (options.length === 0) return null;
  if (options.length === 1) return options[0];

  const modelBrand = inferTechnicalBrandKey(model);
  const normalizedModel = normalizeTitle(model);
  return (
    options.find((brand) => {
      const brandKey = inferTechnicalBrandKey(brand);
      if (modelBrand && brandKey === modelBrand) return true;
      const normalizedBrand = normalizeTitle(brand);
      return normalizedBrand && normalizedModel.includes(normalizedBrand);
    }) || null
  );
};

export const selectionFromVariationType = (choiceOptions, variationType) => {
  const choices = Array.isArray(choiceOptions) ? choiceOptions : [];
  const target = normalizeVariationType(variationType);
  if (!choices.length || !target) return null;

  const selection = Array(choices.length).fill(null);
  const visit = (choiceIndex) => {
    if (choiceIndex === choices.length) {
      const candidate = selection.map(normalizeVariationPart).join("-");
      return candidate === target ? [...selection] : null;
    }

    const options = Array.isArray(choices[choiceIndex]?.options)
      ? choices[choiceIndex].options
      : [];
    for (const option of options) {
      selection[choiceIndex] = option;
      const prefix = selection
        .slice(0, choiceIndex + 1)
        .map(normalizeVariationPart)
        .join("-");
      if (target === prefix || target.startsWith(`${prefix}-`)) {
        const result = visit(choiceIndex + 1);
        if (result) return result;
      }
    }
    selection[choiceIndex] = null;
    return null;
  };

  return visit(0);
};

export const buildVariationCombinations = (choiceOptions, variations) =>
  (Array.isArray(variations) ? variations : [])
    .map((variation) => ({
      variation,
      selection: selectionFromVariationType(choiceOptions, variation?.type),
    }))
    .filter((entry) => Array.isArray(entry.selection));

export const findMatchingVariation = (combinations, selection) => {
  if (!selection?.length || selection.some((value) => value == null)) return null;
  return (
    combinations.find((entry) =>
      entry.selection.every(
        (value, index) =>
          normalizeVariationPart(value) === normalizeVariationPart(selection[index])
      )
    )?.variation || null
  );
};

export const isCompatibleSelection = (
  combinations,
  currentSelection,
  choiceIndex,
  candidate
) =>
  combinations.some((entry) =>
    entry.selection.every((value, index) => {
      if (index === choiceIndex) {
        return normalizeVariationPart(value) === normalizeVariationPart(candidate);
      }
      const selected = currentSelection[index];
      return (
        selected == null ||
        normalizeVariationPart(value) === normalizeVariationPart(selected)
      );
    })
  );
