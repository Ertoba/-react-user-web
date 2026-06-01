import React from "react";
import ReactPlayer from "react-player";
import { Stack } from "@mui/material";

const VideoPlayerWithCenteredControl = ({
  video,
  playing,
  height,
  isMargin,
}) => {
  return (
    <Stack
      sx={{
        position: "relative",
        margin: isMargin && "0px 25px -110px",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0px 15px 30px rgba(0, 0, 0, 0.8)"
            : "0px 15px 30px rgba(150, 150, 154, 0.40)",
        borderRadius: "10px",
        overflow: "hidden",
        height: height ?? "200px",
        backgroundColor: (theme) => theme.palette.neutral[400],
        zIndex: 1,
      }}
    >
      <ReactPlayer
        url={video}
        width="100%"
        height="100%"
        playing={playing}
        loop
        controls={false}
        muted
        playsinline
      />
    </Stack>
  );
};

export default VideoPlayerWithCenteredControl;
