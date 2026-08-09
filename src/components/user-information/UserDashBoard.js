import { Grid } from "@mui/material";
import React from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";

import ProfileStatistics from "../profile/ProfileStatistics";

const UserDashBoard = ({ data, isLoading }) => {
  return (
    <Grid
      container
      item
      md={8}
      alignItems="center"
      spacing={{ xs: 2, sm: 3, md: 5 }}
      paddingTop={{ xs: "10px", sm: "15px", md: "40px" }}
      xs={12}
      sm={12}
    >
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={data?.member_since_days}
          title="Days Since Joining"
          icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />}
          pathname="profile-settings"
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={getAmountWithSign(data?.wallet_balance)}
          title="Amount in Wallet"
          icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 24 }} />}
          pathname="wallet"
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={data?.order_count}
          title="Total Orders"
          icon={<Inventory2OutlinedIcon sx={{ fontSize: 24 }} />}
          pathname="my-orders"
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={data?.loyalty_point}
          title="loyalty points"
          icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 24 }} />}
          pathname="loyalty-points"
        />
      </Grid>
    </Grid>
  );
};

export default UserDashBoard;
