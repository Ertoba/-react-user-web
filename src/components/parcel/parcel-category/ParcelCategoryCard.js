import { useTheme } from "@emotion/react";
import { Card, Box, Tooltip, Typography } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setParcelCategories } from "redux/slices/parcelCategoryData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import RoomServiceOutlinedIcon from "@mui/icons-material/RoomServiceOutlined";

export const getParcelIcon = (name = "") => {
	const normalized = name.toLowerCase();
	if (normalized.includes("დოკუმ") || normalized.includes("document")) return InsertDriveFileOutlinedIcon;
	if (normalized.includes("საჩუქ") || normalized.includes("gift")) return CardGiftcardOutlinedIcon;
	if (normalized.includes("მედ") || normalized.includes("medicine")) return MedicalServicesOutlinedIcon;
	if (normalized.includes("სახლ") || normalized.includes("home")) return HomeOutlinedIcon;
	if (normalized.includes("ბიზნეს") || normalized.includes("business")) return HandshakeOutlinedIcon;
	if (normalized.includes("საკვ") || normalized.includes("food")) return RoomServiceOutlinedIcon;
	return null;
};

const ParcelCard = styled(Card)(({ theme }) => ({
	padding: "20px",
	cursor: "pointer",
	border: "1px solid",
	borderColor: "#EAEEF2",
	transition: "all ease 0.5s",
	"&:hover": {
		boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
		img: {
			transform: "scale(1.1)",
		},
		".MuiTypography-body1:first-child": {
			color: theme.palette.primary.main,
			letterSpacing: "0.02em",
		},
	},
	".MuiTypography-body1:first-child": {
		transition: "all ease 0.5s",
	},
}));

const ParcelCategoryCard = (props) => {
	const theme = useTheme();
	const { data } = props;
	const dispatch = useDispatch();
	const router = useRouter();

	const handleClick = () => {
        if(props.onClick){
            props.onClick(data)
        }else{
            dispatch(setParcelCategories(data));
			router.push("/parcel-delivery-info", undefined, { shallow: true });
        }
	};
	const classes = textWithEllipsis();
	const { ref: textRef, isEllipsed } = useTextEllipsis(data?.name);
	const Icon = getParcelIcon(data?.name);
	return (
    <CustomStackFullWidth>
			<ParcelCard {...props} onClick={handleClick} sx={{borderColor:props?.selected ? theme.palette.primary.main : ""}}>
				<Stack direction="row" alignItems="center" gap={3}>
					<Box
						sx={{
							width: "72px",
							height: "72px",
							flexShrink: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "14px",
							backgroundColor: "transparent",
							color: theme.palette.primary.main,
							img: {
								width: "72px",
								height: "72px",
								objectFit: "contain",
								backgroundColor: "transparent",
							},
						}}>
						{Icon ? (
							<Icon sx={{ fontSize: "54px" }} />
						) : (
							<NextImage
								width={72}
								height={72}
								src={data?.image_full_url}
								objectFit="contain"
							/>
						)}
						</Box>
						<Stack width="100%">
							<Tooltip
								title={data?.name || ""}
								placement="bottom"
								arrow
								disableHoverListener={!isEllipsed}
								componentsProps={{
									tooltip: {
										sx: {
											bgcolor: (theme) => theme.palette.toolTipColor,
											"& .MuiTooltip-arrow": {
												color: (theme) => theme.palette.toolTipColor,
											},
										},
									},
								}}
							>
								<Typography
									ref={textRef}
									fontSize={{ xs: "14px", sm: "18px", md: "18px" }}
									fontWeight="500"
									component="h3"
									sx={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										width: "100%",
									}}
								>
									{data?.name}
								</Typography>
							</Tooltip>
							<Typography
								fontSize={{ xs: "12px", sm: "14px", md: "14px" }}
								color={theme.palette.neutral[400]}
								className={classes.multiLineEllipsis}
								maxHeight="40px"
							>
								{data?.description}
							</Typography>
						</Stack>
				</Stack>
			</ParcelCard>
		</CustomStackFullWidth>
	);
};

export default ParcelCategoryCard;
