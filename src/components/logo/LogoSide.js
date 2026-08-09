import CustomLogo from "./CustomLogo";
import { Stack } from "@mui/system";
import { miliAuthLogoSrc } from "./brandAssets";

const LogoSide = ({ configData, width, height, objectFit }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      width={width || "96px"}
      justifyContent="flex-start"
    >
      <CustomLogo
        atlText="logo"
        logoImg={miliAuthLogoSrc}
        width={width || "90px"}
        height={height || "36px"}
        objectFit={objectFit || "contain"}
      />
    </Stack>
  );
};

LogoSide.propTypes = {};

export default LogoSide;
