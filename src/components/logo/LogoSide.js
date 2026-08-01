import CustomLogo from "./CustomLogo";
import { Stack } from "@mui/system";
import { miliLogoSrc } from "./brandAssets";

const LogoSide = ({ configData, width, height, objectFit }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      width="48px"
      justifyContent="flex-start"
    >
      <CustomLogo
        atlText="logo"
        logoImg={miliLogoSrc}
        width="42px"
        height={height || "48px"}
        objectFit={objectFit}
      />
    </Stack>
  );
};

LogoSide.propTypes = {};

export default LogoSide;
