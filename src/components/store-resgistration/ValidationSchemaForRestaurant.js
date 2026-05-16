import React from "react";

import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const IMAGE_SUPPORTED_FORMATS = [
	"image/jpg",
	"image/jpeg",
	"image/gif",
	"image/png",
	"image/webp",
];
const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;

const ValidationSchemaForRestaurant = () => {
	const { t } = useTranslation();

	return Yup.object({
		restaurant_name: Yup.object().test(
			"required",
			t("Restaurant name required"),
			(value) =>
				value &&
				Object.values(value).some((val) => val && val.trim().length > 0)
		),
		restaurant_address: Yup.mixed()
			.nullable()
			.test(
				"required",
				t("Restaurant address required"),
				(value) =>
					value &&
					Object.values(value).some((val) => val && val.trim().length > 0)
			),
		module_id: Yup.string().required(t("Module is required")),
		f_name: Yup.string().required(t("Name is required")),
		l_name: Yup.string().required(t("Last name required")),
		phone: Yup.string().required(t("Phone number required")),
		min_delivery_time: Yup.string().required(t("Minimum Delivery Time")),
		max_delivery_time: Yup.string().required(t("Maximum Delivery Time")),
		delivery_time_type: Yup.string().required(
			t("Delivery Time is required")
		),
		lat: Yup.string().required(t("Latitude is required")),
		lng: Yup.string().required(t("Longitude is required")),
		logo: Yup.mixed()
			.required()
			.test(
				"fileSize",
				t("Image size must be less than 5MB"),
				(value) => value === null || (value && value.size <= MAX_UPLOAD_FILE_SIZE)
			)
			.test(
				"fileFormat",
				t("Unsupported Format"),
				(value) => value && IMAGE_SUPPORTED_FORMATS.includes(value.type)
			),
		cover_photo: Yup.mixed()
			.required()
			.test(
				"fileSize",
				t("Image size must be less than 5MB"),
				(value) => value === null || (value && value.size <= MAX_UPLOAD_FILE_SIZE)
			)
			.test(
				"fileFormat",
				t("Unsupported Format"),
				(value) => value && IMAGE_SUPPORTED_FORMATS.includes(value.type)
			),
		email: Yup.string()
			.email("Must be a valid email")
			.max(255)
			.required(t("Email is required")),

		password: Yup.string()
			.required("No password provided.")
			.test(
				"password-requirements",
				"Password requirements not met",
				function (value) {
					if (!value) return true; // Handled by required()

					const errors = [];
					if (value.length < 8) {
						errors.push(
							"Password is too short - should be 8 characters minimum."
						);
					}
					if (!/[0-9]/.test(value)) {
						errors.push("one number.");
					}
					if (!/[A-Z]/.test(value)) {
						errors.push("one uppercase letter.");
					}
					if (!/[a-z]/.test(value)) {
						errors.push("one lowercase letter.");
					}
					if (!/[!@#$%^&*(),.?":{}|<>+_=]/.test(value)) {
						errors.push(
							"one special character."
						);
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
		
	});
};

export default ValidationSchemaForRestaurant;
