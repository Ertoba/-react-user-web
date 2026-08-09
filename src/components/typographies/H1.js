import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const H1 = (props) => {
	const { text, textAlign, textTransform, fontWeight, sx, ...rest } = props;

	const { t } = useTranslation();
	return (
		<Typography
			textAlign={textAlign ? textAlign : "center"}
			fontWeight={fontWeight ? fontWeight : "700"}
			lineHeight={{ xs: 1.35, md: 1.4 }}
			sx={{
				fontSize: { xs: "14px", md: "22px" },
				letterSpacing: 0,
				...sx,
			}}
			textTransform={textTransform}
			{...rest}
		>
			{t(text)}
		</Typography>
	);
};

H1.propTypes = {
	text: PropTypes.string.isRequired,
};

export default H1;
