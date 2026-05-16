import * as Yup from "yup";
import { t } from "i18next";

const PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const IDENTITY_IMAGE_TYPES =  ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;

const getFile = (value) => {
  if (!value) return null;
  if (value instanceof File) return value;
  if (Array.isArray(value)) return value[0] || null;
  if (value?.length) return value[0] || null;
  return null;
};

const deliveryManValidationSchema = () => {
  return Yup.object().shape({
    f_name: Yup.string()
      .required(t("First name is required"))
      .min(2, t("First name must be at least 2 characters"))
      .max(50, t("First name can't exceed 50 characters")),

    l_name: Yup.string()
      .required(t("Last name is required"))
      .min(2, t("Last name must be at least 2 characters"))
      .max(50, t("Last name can't exceed 50 characters")),

    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Email is required")),

    phone: Yup.string().required(t("Phone number is required")),

    password: Yup.string()
      .required(t("Password is required"))
      .test(
        "password-requirements",
        t("Password requirements not met"),
        function (value) {
          if (!value) return true;

          const errors = [];

          if (value.length < 8) {
            errors.push(t("Password is too short - should be 8 characters minimum."));
          }
          if (!/[0-9]/.test(value)) {
            errors.push(t("Password must contain at least one number."));
          }
          if (!/[A-Z]/.test(value)) {
            errors.push(t("Password must contain at least one uppercase letter."));
          }
          if (!/[a-z]/.test(value)) {
            errors.push(t("Password must contain at least one lowercase letter."));
          }
          if (!/[!@#$%^&*(),.?":{}|<>+_=]/.test(value)) {
            errors.push(t("Password must contain at least one special character."));
          }

          if (errors.length > 0) {
            return this.createError({ message: errors.join(" ") });
          }

          return true;
        }
      ),

    confirm_password: Yup.string()
      .required(t("Confirm Password required"))
      .oneOf([Yup.ref("password"), null], t("Passwords must match")),

    earning: Yup.number()
      .typeError(t("Earning must be a number"))
      .required(t("Earning is required")),

    zone_id: Yup.string().required(t("Zone selection is required")),

    vehicle_id: Yup.string().required(t("Vehicle selection is required")),

    identity_type: Yup.string()
      .required(t("Identity type is required"))
      .oneOf(["passport", "driving_license", "nid"], t("Invalid identity type")),

    identity_number: Yup.string().required(t("Identity number is required")),

    image: Yup.mixed()
      .required(t("Profile image is required"))
      .test("fileType", t("Only JPG, JPEG, PNG, and WEBP images are allowed"), (value) => {
        const file = getFile(value);
        if (!file) return false;
        return PROFILE_IMAGE_TYPES.includes(file.type);
      })
      .test("fileSize", t("Profile image must be less than 5MB"), (value) => {
        const file = getFile(value);
        if (!file) return false;
        return file.size <= MAX_UPLOAD_FILE_SIZE;
      }),

    identity_image: Yup.mixed()
      .required(t("Identity image is required"))
      .test("fileType", t("Only JPG, JPEG, and PNG images are allowed"), (value) => {
        const file = getFile(value);
        if (!file) return false;
        return IDENTITY_IMAGE_TYPES.includes(file.type);
      })
      .test("fileSize", t("Identity image must be less than 5MB"), (value) => {
        const file = getFile(value);
        if (!file) return false;
        return file.size <= MAX_UPLOAD_FILE_SIZE;
      }),
  });
};

export default deliveryManValidationSchema;
