import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { t } from "i18next";
import AllowLocationDialog from "./AllowLocationDialog";
import { IconButton } from "@mui/material";
import { getFreshCurrentPosition } from "helper-functions/getFreshCurrentPosition";
const UseCurrentLocation = ({
  isLoadingCurrentLocation,
  setLoadingCurrentLocation,
  setLocationEnabled,
  setLocation,
  zoneId,
  setRerenderMap,
  isGeolocationEnabled,
  fromMapModal
}) => {
  const [openLocation, setOpenLocation] = useState(false);
  const handleCloseLocation = () => {
    setOpenLocation(false);
  };
  return (
    <>
      <IconButton
        sx={{
          borderRadius: "50%",
          color: (theme) => theme.palette.primary.main,
          backgroundColor: "background.paper",
          boxShadow: "0px 4.48276px 11.2069px rgba(0, 0, 0, 0.1)",
          width: { xs: "28px", md: "35px" },
          height: { xs: "28px", md: "35px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={async (e) => {
          e.preventDefault();
          setLoadingCurrentLocation(true);
          try {
            const freshLocation = await getFreshCurrentPosition();
            setLocationEnabled(true);
            setLocation(freshLocation);
            if(!fromMapModal){
              if (zoneId) {
                localStorage.setItem("zoneid", zoneId);
                // router.push('/home')
                // handleClose()
              }
            }
            setRerenderMap((prevState) => !prevState);
          } catch {
            setOpenLocation(true);
          } finally {
            setLoadingCurrentLocation(false);
          }
        }}
      >
        <GpsFixedIcon sx={{ fontSize: { xs: "18px", md: "24px" } }} />
      </IconButton>
      {openLocation && (
        <AllowLocationDialog
          handleCloseLocation={handleCloseLocation}
          openLocation={openLocation}
          isGeolocationEnabled={isGeolocationEnabled}
        />
      )}
    </>
  );
};

export default UseCurrentLocation;
