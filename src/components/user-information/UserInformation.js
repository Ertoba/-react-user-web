import { Box, Grid, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { useDeleteProfile } from "api-manage/hooks/react-query/profile/useDeleteProfile";
import { getToken } from "helper-functions/getToken";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setWalletAmount } from "redux/slices/cart";
import { setUser } from "redux/slices/profileInfo";
import {
	CustomStackFullWidth,
	UserInfoGrid,
} from "styled-components/CustomStyles.style";
import useGetUserInfo from "../../api-manage/hooks/react-query/user/useGetUserInfo";
import PushNotificationLayout from "../PushNotificationLayout";
import CustomContainer from "../container";
import BodySection from "./BodySection";
import UserDashBoard from "./UserDashBoard";
import UserDetails from "./UserDetails";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import MobileProfileOverview from "./MobileProfileOverview";
import { getProfileMobileTitle } from "./profileMobilePageTitles.mjs";

const UserInformation = ({ page, configData, orderId }) => {
	const theme = useTheme();
	useScrollToTop()
	const [accountDeleteStatus, setAccountDeleteStatus] = useState(true);
	const isSmall = useMediaQuery(theme.breakpoints.down("md"));
	const isV42Mobile = useMediaQuery("(max-width:1180px)");
	const activePage = typeof page === "string" ? page : null;
	const dispatch = useDispatch();
	const router = useRouter();
	const handleSuccess = (res) => {
		localStorage.setItem("wallet_amount", res?.wallet_balance);
		dispatch(setWalletAmount(res?.wallet_balance));
		dispatch(setUser(res));
	};
	const userToken = getToken();
	const { data, refetch, isLoading } = useGetUserInfo(handleSuccess);
	const onSuccessHandlerForUserDelete = (res) => {
		if (res?.errors) {
			// toast.error(res?.errors?.[0]?.message);
			setAccountDeleteStatus(false);
		} else {
			localStorage.removeItem("token");
			toast.success(t("Account has been deleted"));
			dispatch(setUser(null));
			router.push("/", undefined, { shallow: true });
		}
	};
	const { mutate, isLoading: isLoadingDelete } = useDeleteProfile(
		onSuccessHandlerForUserDelete
	);
	const deleteUserHandler = () => {
		mutate();
	};

  const handleMobileBack = () => {
    const moduleParam = typeof router.query.module === "string" ? router.query.module : null;
    const preservedModule = moduleParam ? { module: moduleParam } : {};
    if (activePage === "my-orders" && orderId) {
      router.push({
        pathname: "/profile",
        query: {
          ...preservedModule,
          page: "my-orders",
          ...(router.query.orderTabModule
            ? { orderTabModule: router.query.orderTabModule }
            : {}),
        },
      });
      return;
    }
    router.push({ pathname: "/profile", query: preservedModule });
  };

	if (isV42Mobile && userToken && !page) {
		return (
			<PushNotificationLayout>
				<MobileProfileOverview
					data={data}
					isLoading={isLoading}
					configData={configData}
					token={userToken}
				/>
			</PushNotificationLayout>
		);
	}

	return (
		<PushNotificationLayout>
			<CustomStackFullWidth>
          {isV42Mobile && activePage && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1251,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                px: "8px",
                minHeight: "64px",
                backgroundColor: "background.paper",
                borderRadius: "0 0 16px 16px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <IconButton
                aria-label={t("Back")}
                onClick={handleMobileBack}
                sx={{ p: "8px", color: "text.primary" }}
              >
                <i
                  className="fi fi-rr-arrow-small-left"
                  style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
                />
              </IconButton>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                }}
              >
                {t(getProfileMobileTitle(activePage, Boolean(orderId)))}
              </Typography>
            </Box>
          )}
				<Grid container gap="10px">
					{!isV42Mobile && (
					<UserInfoGrid
						userToken={userToken}
						container
						item
						xs={12}
						sm={12}
						md={12}
						page={page}
					>
						{!userToken && (
							<Grid
								item
								xs={12}
								justifyContent="center"
								alignSelf="center"
							>
								<Typography fontSize="16px" textAlign="center">
									{t("Order Details")}
								</Typography>
							</Grid>
						)}
						<CustomContainer>
							<Stack
								direction={{
									xs: "column",
									sm: "column",
									md: "row",
								}}
								gap="1rem"
							>
								{userToken && (
									<Grid
										item
										xs={12}
										sm={12}
										md={4}
										marginTop={{
											xs: page ? "21px" : "28px",
											sm: "28px",
											md: "18px",
										}}
										paddingBottom={{
											xs:
												page === "inbox"
													? "10px"
													: "0px",
										}}
									>
										<UserDetails
											data={data}
											page={page}
											deleteUserHandler={
												deleteUserHandler
											}
											setAccountDeleteStatus={
												setAccountDeleteStatus
											}
											accountDeleteStatus={
												accountDeleteStatus
											}
											isLoadingDelete={isLoadingDelete}
										/>
									</Grid>
								)}

								{isSmall ? (
									page === "profile-settings" &&
									userToken && (
										<UserDashBoard
											data={data}
											isLoading={isLoading}
										/>
									)
								) : (
									<>
										{userToken && (
											<UserDashBoard
												data={data}
												isLoading={isLoading}
											/>
										)}
									</>
								)}
							</Stack>
						</CustomContainer>
					</UserInfoGrid>
          )}
					<Grid item xs={12} sm={12} md={12}>
						<CustomContainer>
							<BodySection
								page={page}
								configData={configData}
								orderId={orderId}
								userToken={userToken}
								deleteUserHandler={deleteUserHandler}
								accountDeleteStatus={accountDeleteStatus}
								setAccountDeleteStatus={setAccountDeleteStatus}
								isLoadingDelete={isLoadingDelete}
							/>
						</CustomContainer>
					</Grid>
				</Grid>
			</CustomStackFullWidth>
		</PushNotificationLayout>
	);
};

export default UserInformation;
