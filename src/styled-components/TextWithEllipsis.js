import { makeStyles } from "@mui/styles";

const LINES_TO_SHOW = 1;

export const textWithEllipsis = makeStyles({
  multiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: LINES_TO_SHOW,
    WebkitBoxOrient: "vertical",
  },
  singleLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
});
