import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Subtitle1 = (props) => {
	const { text, textAlign, sx, ...rest } = props;
	const { t } = useTranslation();

	return (
		<Typography
			textAlign={textAlign ? textAlign : "center"}
			fontWeight="400"
			sx={{
				color: "text.secondary",
				fontSize: { xs: "12.5px", sm: "14px", md: "16px" },
				lineHeight: { xs: "18px", sm: "20px", md: "24px" },
				letterSpacing: 0,
				overflowWrap: "break-word",
				wordBreak: "normal",
				...sx,
			}}
			{...rest}
		>
			{t(text)}
		</Typography>
	);
};

Subtitle1.propTypes = {};

export default Subtitle1;
