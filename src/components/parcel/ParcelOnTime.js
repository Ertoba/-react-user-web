import React, { useEffect } from "react";
import { SliderCustom } from "styled-components/CustomStyles.style";
import { Box, Skeleton, Stack, styled } from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import useGetOtherBanners from "../../api-manage/hooks/react-query/useGetOtherBanners";
import Slider from "react-slick";

const BgBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  overflow: "hidden",
}));

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  dot: true,
};
const ParcelOnTime = () => {
  const { data, refetch, isLoading } = useGetOtherBanners();
  const validBanners = (data?.banners ?? []).filter(
    (item) => Boolean(item?.value_full_url)
  );
  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="370px" />
      ) : (
        <>
          {validBanners.length > 0 && (
            <BgBox>
              <SliderCustom>
                <Slider {...settings}>
                  {validBanners.map((item, index) => {
                    return (
                      <Stack key={index}>
                        <CustomImageContainer
                          src={item.value_full_url}
                          width="100%"
                          objectfit="cover"
                          aspectRatio="4/1"
                          borderRadius="8px"
                        />
                      </Stack>
                    );
                  })}
                </Slider>
              </SliderCustom>
            </BgBox>
          )}
        </>
      )}
    </>
  );
};

export default ParcelOnTime;
