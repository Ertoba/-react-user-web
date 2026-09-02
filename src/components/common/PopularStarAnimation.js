import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Box, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import popularStarAnimation from "../../assets/animations/popular-star.json";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
  loading: () => <Box sx={{ width: "100%", height: "100%" }} />,
});

const PopularStarAnimation = ({ size = 30 }) => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      {reduceMotion ? (
        <AutoAwesomeRoundedIcon color="primary" sx={{ fontSize: size - 2 }} />
      ) : (
        <Lottie
          width={size}
          height={size}
          isClickToPauseDisabled
          options={{
            loop: true,
            autoplay: true,
            animationData: popularStarAnimation,
            rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
          }}
        />
      )}
    </Box>
  );
};

export default PopularStarAnimation;
