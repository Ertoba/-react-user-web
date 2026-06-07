import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import parcelImage from "../assets/parcel.svg";

const TopBanner = () => {
  const [moduleType, setModuleType] = useState(null);
  const router = useRouter();

  // Ensure moduleType is set on the client
  useEffect(() => {
    setModuleType(getCurrentModuleType());
  }, []);

  const queryModule = Array.isArray(router.query.module)
    ? router.query.module[0]
    : router.query.module;
  const isAmanatiHome =
    moduleType === ModuleTypes.PARCEL &&
    (queryModule === "amanati" || router.asPath.includes("module=amanati"));

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
    >
      {isAmanatiHome && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            img: { objectFit: "cover", width: "100%", height: "100%" },
          }}
        >
          <Image
            width={1917}
            height={270}
            src={parcelImage?.src}
            alt="banner"
            priority
          />
        </Box>
      )}
    </CustomBoxFullWidth>
  );
};

export default TopBanner;
