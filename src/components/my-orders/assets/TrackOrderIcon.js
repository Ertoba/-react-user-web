import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const TrackOrderIcon = (props) => (
  <LocationOnOutlinedIcon
    {...props}
    sx={{ width: 20, height: 20, color: "currentColor", ...props.sx }}
  />
);

export default TrackOrderIcon;
