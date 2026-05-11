import React from "react";
import CustomImageContainer from "../CustomImageContainer";
import { Typography } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { miliLogoSrc } from "components/logo/brandAssets";

const AuthHeader = ({ title, configData }) => {
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  const router = useRouter();
  const handleLogoClick = () => {
    if (router.pathname.includes("/auth")) {
      router.push("/home", undefined, { shallow: true });
    }
  };
  return (
    <CustomStackFullWidth
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Box onClick={handleLogoClick}>
        <CustomImageContainer
          maxWidth="360px"
          height="74px"
          objectfit="contain"
          src={miliLogoSrc}
        />
      </Box>

      <Typography
        fontSize="18px"
        fontWeight="600"
        textAlign="left"
        textTransform="uppercase"
      >
        {title}
      </Typography>
    </CustomStackFullWidth>
  );
};

export default AuthHeader;
