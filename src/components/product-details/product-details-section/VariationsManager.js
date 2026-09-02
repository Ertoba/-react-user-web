import React, { useEffect, useMemo, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { t } from "i18next";
import { Stack } from "@mui/system";
import { CustomSizeBox } from "../ProductDetails.style";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import {
  buildVariationCombinations,
  findMatchingVariation,
  inferTechnicalBrandKey,
  isCompatibleSelection,
  isTechnicalBrandTitle,
  isTechnicalModelTitle,
  legacyBrandForTechnicalModel,
  selectionFromVariationType,
  sortTechnicalModels,
  technicalBrandLabel,
} from "./variationSelection";

const getSelectedIndex = (options, selectedOptions) => {
  let index = 0;
  options?.forEach((option, indexNumber) => {
    if (selectedOptions?.type?.split("-")?.includes(option.trim())) {
      index = indexNumber;
    }
  });
  return index;
};
const LegacyVariationsManager = ({ productDetailsData, handleChoices }) => {
  const [choice, setChoice] = useState(null);
  const [value, setValue] = useState(
    productDetailsData?.choice_options?.map((i) => ({
      type: i?.title,
      value:
        i?.options[
        getSelectedIndex(i?.options, productDetailsData?.selectedOption?.[0])
        ],
    }))
  );
  const handleClick = (values, index, choice) => {
    setValue((prev) => {
      prev[index].value = values;
      return [...prev];
    });
    setChoice(choice);
  };
  useEffect(() => {
    handleChoice(value);
  }, [value]);
  const handleChoice = (value) => {
    let finalVariation = "";
    value.forEach((item) => (finalVariation += item.value));
    let option = productDetailsData?.variations?.filter(
      (item) =>
        item.type.replaceAll("-", "").replaceAll(" ", "") ===
        finalVariation.replaceAll("-", "").replaceAll(" ", "")
    );

    if (choice && option?.length > 0) {
      handleChoices(option[0], choice);
    }
  };
  return (
    <CustomStackFullWidth spacing={1.4}>
      {productDetailsData?.choice_options?.map((choice, choiceIndex) => (
        <CustomStackFullWidth key={choiceIndex}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography fontWeight="600" paddingBottom="3px">
              {choice?.title}
            </Typography>
            {/*<Typography fontWeight="600">:</Typography>*/}
            {/*<Typography fontWeight="400">{state.productColor}</Typography>*/}
          </Stack>
          <CustomStackFullWidth direction="row" spacing={2}>
            {choice?.options?.map((item, index) => (
              <CustomSizeBox
                key={index}
                onClick={() => handleClick(item, choiceIndex, choice)}
                size={item}
                productsize={value[choiceIndex]?.value}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {item}
                </Typography>
              </CustomSizeBox>
            ))}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      ))}
      {productDetailsData?.selectedOption?.length > 0 &&
        productDetailsData?.selectedOption?.[0]?.stock == 0 ? (
        <Typography color="red">
          *{t("This variation is out of stock")}
        </Typography>
      ) : (
        <Typography></Typography>
      )}
    </CustomStackFullWidth>
  );
};

const ExplicitVariationsManager = ({ productDetailsData, handleChoices }) => {
  const choices = useMemo(
    () => productDetailsData?.choice_options || [],
    [productDetailsData?.choice_options]
  );
  const variations = useMemo(
    () => productDetailsData?.variations || [],
    [productDetailsData?.variations]
  );
  const combinations = useMemo(
    () => buildVariationCombinations(choices, variations),
    [choices, variations]
  );
  const modelIndex = choices.findIndex((choice) =>
    isTechnicalModelTitle(choice?.title)
  );
  const brandIndex =
    modelIndex >= 0
      ? choices.findIndex((choice) => isTechnicalBrandTitle(choice?.title))
      : -1;
  const existingType = productDetailsData?.selectedOption?.[0]?.type;
  const initialSelection = useMemo(
    () =>
      selectionFromVariationType(choices, existingType) ||
      Array(choices.length).fill(null),
    [choices, existingType]
  );
  const [selection, setSelection] = useState(initialSelection);

  const updateSelection = (choiceIndex, nextValue) => {
    const nextSelection = [...selection];
    nextSelection[choiceIndex] = nextValue;

    if (choiceIndex === modelIndex && brandIndex >= 0) {
      nextSelection[brandIndex] = nextValue
        ? legacyBrandForTechnicalModel(
            nextValue,
            choices[brandIndex]?.options || []
          )
        : null;
    }

    choices.forEach((_, index) => {
      if (index === choiceIndex || index === brandIndex) return;
      if (choiceIndex === modelIndex || index > choiceIndex) {
        nextSelection[index] = null;
      }
    });

    setSelection(nextSelection);
    handleChoices(findMatchingVariation(combinations, nextSelection));
  };

  const compatibilitySelection = (choiceIndex, option) => {
    const candidateSelection = [...selection];
    candidateSelection[choiceIndex] = option;

    if (choiceIndex === modelIndex && brandIndex >= 0) {
      candidateSelection[brandIndex] = legacyBrandForTechnicalModel(
        option,
        choices[brandIndex]?.options || []
      );
    }

    choices.forEach((_, index) => {
      if (index === choiceIndex || index === brandIndex) return;
      if (choiceIndex === modelIndex || index > choiceIndex) {
        candidateSelection[index] = null;
      }
    });
    return candidateSelection;
  };

  const visibleChoices = choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ index }) => index !== brandIndex);
  const hasCompleteVisibleSelection = visibleChoices.every(
    ({ index }) => selection[index] != null
  );
  const selectedVariation = findMatchingVariation(combinations, selection);

  return (
    <CustomStackFullWidth spacing={1.5}>
      {visibleChoices.map(({ choice, index }) => {
        const isModel = index === modelIndex;
        const rawOptions = Array.isArray(choice?.options) ? choice.options : [];
        const options = isModel ? sortTechnicalModels(rawOptions) : rawOptions;
        const value = options.find((option) => option === selection[index]) || null;

        return (
          <Autocomplete
            key={`${choice?.title || "variation"}-${index}`}
            fullWidth
            value={value}
            options={options}
            onChange={(_, nextValue) => updateSelection(index, nextValue)}
            autoHighlight
            clearOnBlur={false}
            noOptionsText={t("No matching options")}
            getOptionDisabled={(option) => {
              if (
                isModel &&
                brandIndex >= 0 &&
                !legacyBrandForTechnicalModel(
                  option,
                  choices[brandIndex]?.options || []
                )
              ) {
                return true;
              }
              return !isCompatibleSelection(
                combinations,
                compatibilitySelection(index, option),
                index,
                option
              );
            }}
            groupBy={
              isModel
                ? (option) =>
                    technicalBrandLabel(inferTechnicalBrandKey(option))
                : undefined
            }
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label={choice?.title}
                placeholder={t("Select an option")}
                size="small"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "off",
                }}
              />
            )}
            sx={{
              "& .MuiInputBase-root": { minHeight: 52 },
              "& .MuiAutocomplete-groupLabel": {
                fontWeight: 700,
              },
            }}
          />
        );
      })}

      {hasCompleteVisibleSelection && !selectedVariation && (
        <Typography color="error" fontSize="13px">
          {t("This option combination is unavailable")}
        </Typography>
      )}
      {selectedVariation?.stock === 0 && (
        <Typography color="error" fontSize="13px">
          *{t("This variation is out of stock")}
        </Typography>
      )}
    </CustomStackFullWidth>
  );
};

const VariationsManager = ({ productDetailsData, handleChoices }) => {
  const moduleType =
    productDetailsData?.module_type ||
    productDetailsData?.module?.module_type ||
    getCurrentModuleType();

  if (moduleType === "ecommerce" && productDetailsData?.choice_options?.length) {
    return (
      <ExplicitVariationsManager
        productDetailsData={productDetailsData}
        handleChoices={handleChoices}
      />
    );
  }

  return (
    <LegacyVariationsManager
      productDetailsData={productDetailsData}
      handleChoices={handleChoices}
    />
  );
};

export default VariationsManager;
