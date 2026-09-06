import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const H2 = (props) => {
  const { text, textAlign, sx, ...rest } = props;
  const { t } = useTranslation();

  return (
    <Typography
      textAlign={textAlign ? textAlign : "center"}
      textTransform="capitalize"
      sx={{
        fontSize: { xs: "16px", sm: "19px", md: "24px" },
        lineHeight: { xs: 1.3, sm: 1.35, md: 1.4 },
        fontWeight: 600,
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

H2.propTypes = {
  text: PropTypes.string.isRequired,
};

export default H2;
