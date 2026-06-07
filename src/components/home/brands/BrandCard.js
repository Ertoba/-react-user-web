/* eslint-disable @next/next/no-img-element */
import { useTheme } from "@emotion/react";
import { alpha, Typography, useMediaQuery } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import Link from "next/link";
import { memo } from "react";
import placeholder from "../assets/product.png";
import NextImage from "components/NextImage";

const BrandCard = (props) => {
	const { image, name, stock, id, horizontal, baseUrl, items_count } = props;
	const theme = useTheme();
	const imageUrl = image || placeholder.src;
	const tabScreen = useMediaQuery("(max-width: 991px)");

	return (
		<>
			<Stack
				sx={{
					flexDirection: horizontal ? "column" : "row",
					textAlign: horizontal ? "center" : "",
					alignItems: "center",
					columnGap: "8px",
					position: "relative",
					transition: "all ease .3s",
					padding: "10px",
					borderRadius: "4px",
					":hover": {
						boxShadow: horizontal ? "" : theme.shadows[14],
					},
					a: {
						position: "absolute",
						inset: "0",
					},
				}}
			>
				<Link href={`/search?brand_id=${id}&data_type=brand`} />
				<Stack
					sx={{
						width: horizontal
							? { xs: "124px", md: "132px" }
							: { xs: "58px", md: "70px", lg: "78px" },
						height: horizontal
							? { xs: "124px", md: "132px" }
							: { xs: "58px", md: "70px", lg: "78px" },
						marginBottom: horizontal ? "10px" : "0",
						flexShrink: 0,
						alignItems: "center",
						justifyContent: "center",
						padding: horizontal ? "10px" : "6px",
						borderRadius: horizontal ? "16px" : "12px",
						backgroundColor: theme.palette.background.paper,
						border: `1px solid ${alpha(theme.palette.neutral[400], theme.palette.mode === "dark" ? 0.35 : 0.22)}`,
						boxShadow: `0 8px 18px ${alpha(theme.palette.neutral[1000], theme.palette.mode === "dark" ? 0.18 : 0.06)}`,
						overflow: "hidden",
						img: {
							maxWidth: "100%",
							transition: "all ease .3s",
							height: "100%",
							width: "100%",
							objectFit: "contain",
							aspectRatio: "1",
							borderRadius: horizontal ? "12px" : "8px",
						},
					}}
					className="brand-card-image"
				>
					<NextImage
						src={imageUrl}
						loading="lazy"
						width={200}
						height={200}
						alt="Brand"
					/>
				</Stack>
				<Box width={horizontal ? "100%" : "0"} flexGrow={"1"}>
					{name && (
						<Typography
							variant="h6"
							sx={{
								fontSize: horizontal
									? "18px"
									: { xs: "14px !important" },
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: { xs: "1", sm: "2" },
								overflow: "hidden",
								textOverflow: "ellipsis",
								fontWeight: "600",
							}}
							component="h3"
						>
							{name}
						</Typography>
					)}
					<Typography
						variant="body2"
						sx={{ opacity: "0.8", fontSize: { xs: "10px", md: "14px" } }}
						component="span"
					>
						{items_count} {t("Products")}
					</Typography>
				</Box>
			</Stack>
		</>
	);
};

BrandCard.propTypes = {};

export default memo(BrandCard);
