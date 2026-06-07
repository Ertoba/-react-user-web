import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useEffect, useState } from "react";

const TopBanner = () => {
  const [moduleType, setModuleType] = useState(null);

  // Ensure moduleType is set on the client
  useEffect(() => {
    setModuleType(getCurrentModuleType());
  }, []);

  return (
    <CustomBoxFullWidth
      sx={{
        minHeight: {
          xs: moduleType === ModuleTypes.PARCEL ? "250px" : "160px",
          sm: "270px",
          md: "270px",
        },
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
};

export default TopBanner;
