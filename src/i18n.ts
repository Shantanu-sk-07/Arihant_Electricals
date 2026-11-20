import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { useMemo } from "react";
import type { TFunction } from "i18next";

const resources = {
  en: {
    translation: {
      components: {
        aadhaarCardField: {
          requiredError: "{{label}} is required",
          invalidError: "Invalid Aadhaar number",
        },
        dateTimeField: {
          requiredError: "{{label}} is required",
        },
        dropdownField: {
          requiredError: "{{label}} is required",
          emptyError: "Please select an option",
          notInListError: "Please select item from list",
          minLengthError: "Minimum {{min}} characters required",
          zeroNotAllowedError: "0 is not allowed",
        },
        emailField: {
          requiredError: "{{label}} is required",
          invalidFormat: "Invalid email format",
          invalidDomain: "Invalid email domain",
        },
        mobileField: {
          requiredError: "{{label}} is required",
          invalidFormat: "Invalid mobile number",
          maxDigits: "Maximum 10 digits allowed",
          minDigits: "Minimum 10 digits required",
        },
        numericField: {
          requiredError: "{{label}} is required",
          invalidNumber: "{{label}} must be a valid number",
          onlyNumbers: "{{label}} must contain only numbers",
          minValue: "{{label}} must be at least {{min}}",
          maxValue: "{{label}} must be at most {{max}}",
          decimalLimit: "{{label}} allows only {{digits}} decimal places",
        },
        passwordField: {
          requiredError: "{{label}} is required",
          minLength: "Password must be at least {{min}} characters",
          maxLength: "Password must be at most {{max}} characters",
          complexityHint:
            "Must contain uppercase, lowercase, number, and special character",
          mismatch: "Passwords do not match",
        },
        searchField: {
          requiredError: "{{label}} is required",
        },
        textInputField: {
          requiredError: "{{label}} is required",
          minLength: "Minimum {{min}} characters required",
          maxLength: "Maximum {{max}} characters allowed",
          validation: {
            alphanumeric: "Only letters and numbers allowed",
            alphabets: "Only letters allowed",
            numbers: "Only numbers allowed",
            email: "Invalid email format",
            textarea: "Invalid text",
          },
        },
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export const getComponentTranslations = (t: TFunction) => ({
  aadhaarCardField: {
    requiredError: (label: string) =>
      t("components.aadhaarCardField.requiredError", { label }),
    invalidError: t("components.aadhaarCardField.invalidError"),
  },
  dateTimeField: {
    requiredError: (label: string) =>
      t("components.dateTimeField.requiredError", { label }),
  },
  dropdownField: {
    requiredError: (label: string) =>
      t("components.dropdownField.requiredError", { label }),
    emptyError: t("components.dropdownField.emptyError"),
    notInListError: t("components.dropdownField.notInListError"),
    minLengthError: (min: number) =>
      t("components.dropdownField.minLengthError", { min }),
    zeroNotAllowedError: t("components.dropdownField.zeroNotAllowedError"),
  },
  emailField: {
    requiredError: (label: string) =>
      t("components.emailField.requiredError", { label }),
    invalidFormat: t("components.emailField.invalidFormat"),
    invalidDomain: t("components.emailField.invalidDomain"),
  },
  mobileField: {
    requiredError: (label: string) =>
      t("components.mobileField.requiredError", { label }),
    invalidFormat: t("components.mobileField.invalidFormat"),
    maxDigits: t("components.mobileField.maxDigits"),
    minDigits: t("components.mobileField.minDigits"),
  },
  numericField: {
    requiredError: (label: string) =>
      t("components.numericField.requiredError", { label }),
    invalidNumber: (label: string) =>
      t("components.numericField.invalidNumber", { label }),
    onlyNumbers: (label: string) =>
      t("components.numericField.onlyNumbers", { label }),
    minValue: (label: string, min: number | string) =>
      t("components.numericField.minValue", {
        label,
        min: typeof min === "number" ? min.toString() : min,
      }),
    maxValue: (label: string, max: number | string) =>
      t("components.numericField.maxValue", {
        label,
        max: typeof max === "number" ? max.toString() : max,
      }),
    decimalLimit: (label: string, digits: number) =>
      t("components.numericField.decimalLimit", { label, digits }),
  },
  passwordField: {
    requiredError: (label: string) =>
      t("components.passwordField.requiredError", { label }),
    minLength: (min: number) =>
      t("components.passwordField.minLength", { min }),
    maxLength: (max: number) =>
      t("components.passwordField.maxLength", { max }),
    complexityHint: t("components.passwordField.complexityHint"),
    mismatch: t("components.passwordField.mismatch"),
  },
  searchField: {
    requiredError: (label: string) =>
      t("components.searchField.requiredError", { label }),
  },
  textInputField: {
    requiredError: (label: string) =>
      t("components.textInputField.requiredError", { label }),
    minLength: (min: number) =>
      t("components.textInputField.minLength", { min }),
    maxLength: (max: number) =>
      t("components.textInputField.maxLength", { max }),
    validation: {
      alphanumeric: t("components.textInputField.validation.alphanumeric"),
      alphabets: t("components.textInputField.validation.alphabets"),
      numbers: t("components.textInputField.validation.numbers"),
      email: t("components.textInputField.validation.email"),
      textarea: t("components.textInputField.validation.textarea"),
    },
  },
});

export const useComponentTranslations = () => {
  const { t } = useTranslation();
  return useMemo(() => getComponentTranslations(t), [t]);
};

export default i18n;