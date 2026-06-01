import React, { useEffect, useState } from "react";
import {Button, Popover, Stack, Typography, useTheme} from "@mui/material";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import CustomAlert from "../../../alert/CustomAlert";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import DeliveryAddress from "../../../checkout/delivery-address";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import useGetGeoCode from "../../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../../api-manage/hooks/react-query/google-api/useGetZone";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { getFreshCurrentPosition } from "helper-functions/getFreshCurrentPosition";
const MapModal = dynamic(() => import("../../../Map/MapModal"));
const AddressReselectPopover = (props) => {
  const { anchorEl, onClose, open, t, address, setAddress, token, currentLatLngForMar, ...other } =
    props;
  const theme = useTheme();
  const [openMapModal, setOpenMapModal] = useState(false);
  const [location, setLocation] = useState(undefined);
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [geoLocationEnable, setGeoLocationEnable] = useState(false);
  const [zoneIdEnabled, setZoneIdEnabled] = useState(false);
  const [isLoadingCurrentLocation, setLoadingCurrentLocation] = useState(false);

  const handleAgreeLocation = async () => {
    setLoadingCurrentLocation(true);
    setShowCurrentLocation(false);
    setCurrentLocation(undefined);
    try {
      const freshLocation = await getFreshCurrentPosition();
      setLocation(freshLocation);
      setShowCurrentLocation(true);
      setGeoLocationEnable(true);
      setZoneIdEnabled(true);
    } catch {
      toast.error(t("Please allow browser location permission"));
    } finally {
      setLoadingCurrentLocation(false);
    }
  };
  const { data: geoCodeResults, isFetching: isFetchingGeoCode } = useGetGeoCode(
    location,
    geoLocationEnable
  );

  useEffect(() => {
    if (geoCodeResults?.results && showCurrentLocation) {
      setCurrentLocation(geoCodeResults?.results[0]?.formatted_address);
    }
  }, [geoCodeResults, location]);

  const { data: zoneData, isFetching: isFetchingZone } = useGetZoneId(
    location,
    zoneIdEnabled
  );

  useEffect(() => {
    if (typeof window === "undefined" || !zoneData?.zone_id) {
      return;
    }
    localStorage.setItem("zoneid", zoneData.zone_id);
    if (
      showCurrentLocation &&
      currentLocation &&
      location &&
      !isFetchingGeoCode &&
      !isFetchingZone
    ) {
      localStorage.setItem("location", currentLocation);
      localStorage.setItem("currentLatLng", JSON.stringify(location));
      window.location.reload();
    }
  }, [
    currentLocation,
    isFetchingGeoCode,
    isFetchingZone,
    location,
    showCurrentLocation,
    zoneData,
  ]);
  const handleCloseMapModal = () => {
    setOpenMapModal(false);
    onClose();
  };
  const popOverHeightHandler = () => {
    if (token) {
      return "475px";
    } else {
      return "150px";
    }
  };
  return (
    <>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        onClose={onClose}
        open={open}
        PaperProps={{
          sx: { width: { xs: 300, sm: 320, md: 350 }, p: "1rem" },
        }}
        transitionDuration={2}
        {...other}
      >
        <Stack justifyContent="center" textAlign="center" spacing={2}>
          <SimpleBar
            className="custom-scrollbar"
            style={{
              maxHeight: popOverHeightHandler(),
              paddingRight: "5px",
            }}
          >
            <Stack width="100%" alignItems="center">
              {token ? (
                open && (
                  <Stack
                    pt="15px"
                    gap={{ xs: "0px", sm: "15px" }}
                    paddingRight="5px"
                  >
                    <Typography
                      fontSize="16px"
                      fontWeight={500}
                      textAlign="left"
                    >
                      {t("Select from saved addresses or pick from map")}
                    </Typography>
                    <DeliveryAddress
                      setAddress={setAddress}
                      address={address}
                      hideAddressSelectionField="true"
                      renderOnNavbar="true"
                    />
                  </Stack>
                )
              ) : (
                <CustomAlert
                  type="info"
                  text={t(
                    "To select from saved addresses, you need to sign in."
                  )}
                />
              )}
            </Stack>
          </SimpleBar>
         <Button
           fullWidth
              onClick={handleAgreeLocation}
              disabled={isLoadingCurrentLocation}
              startIcon={
                <ControlPointOutlinedIcon sx={{ color: theme.palette.primary.main }} />
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontWeight: 600,
                color: theme.palette.primary.main,
              }}
            >
              {t("Use Current Location")}
            </Button>
          <Stack width="100%" justifyContent="center" alignItems="center">
            <CustomButtonPrimary onClick={() => setOpenMapModal(true)}>
              {t("Pick from map")}
            </CustomButtonPrimary>
          </Stack>
        </Stack>
      </Popover>
      {openMapModal && (
        <MapModal open={openMapModal} handleClose={handleCloseMapModal}  selectedLocation={currentLatLngForMar}/>
      )}
    </>
  );
};

AddressReselectPopover.propTypes = {};

export default AddressReselectPopover;
