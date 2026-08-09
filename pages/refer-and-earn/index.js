import React, { useEffect, useState } from "react";
import { Box, Button, CssBaseline, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import MainLayout from "../../src/components/layout/MainLayout";
import CustomContainer from "../../src/components/container";
import SEO from "../../src/components/seo";
import AuthModal from "../../src/components/auth/AuthModal";
import ReferAFriend from "../../src/components/referral-code/svg/ReferAFriend";
import {
  PENDING_REFERRAL_CODE_KEY,
  sanitizeReferralCode,
} from "../../src/helper-functions/referralLink";

const ReferAndEarnPage = ({ configData }) => {
  const router = useRouter();
  const [openAuth, setOpenAuth] = useState(false);
  const [modalFor, setModalFor] = useState("sign-up");
  const referralCode = sanitizeReferralCode(router.query.code);
  const referralEnabled = Number(configData?.ref_earning_status) === 1;

  useEffect(() => {
    if (!router.isReady || !referralCode) return;
    localStorage.setItem(PENDING_REFERRAL_CODE_KEY, referralCode);
  }, [router.isReady, referralCode]);

  const handleJoin = () => {
    setModalFor("sign-up");
    setOpenAuth(true);
  };

  return (
    <>
      <CssBaseline />
      <SEO
        title={`მოიწვიე მეგობარი - ${configData?.business_name || "Mili"}`}
        description="დარეგისტრირდი რეფერალური კოდით"
        image={configData?.logo_full_url}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <CustomContainer>
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={3}
            sx={{ minHeight: { xs: "62vh", md: "68vh" }, py: 5 }}
          >
            <Box sx={{ width: "100%", maxWidth: 420 }}>
              <ReferAFriend />
            </Box>
            <Typography
              component="h1"
              fontWeight={700}
              textAlign="center"
              sx={{
                width: "100%",
                maxWidth: { xs: "calc(100vw - 32px)", sm: 620 },
                px: { xs: 2, sm: 0 },
                fontSize: { xs: "18px", sm: "24px", md: "32px" },
                lineHeight: 1.45,
                whiteSpace: "normal !important",
                wordBreak: "normal",
                overflowWrap: "anywhere",
              }}
            >
              {referralEnabled
                ? "რეფერალური რეგისტრაცია"
                : "რეფერალური პროგრამა ამჟამად მიუწვდომელია"}
            </Typography>
            {referralEnabled && referralCode && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                  border: "1px dashed",
                  borderColor: "primary.main",
                  borderRadius: "6px",
                  px: 3,
                  py: 1.5,
                }}
              >
                <Typography color="primary.main" fontWeight={700}>
                  {referralCode}
                </Typography>
              </Stack>
            )}
            {referralEnabled && referralCode && (
              <Button variant="contained" size="large" onClick={handleJoin}>
                რეგისტრაცია
              </Button>
            )}
          </Stack>
        </CustomContainer>
      </MainLayout>
      <AuthModal
        modalFor={modalFor}
        setModalFor={setModalFor}
        open={openAuth}
        handleClose={() => setOpenAuth(false)}
      />
    </>
  );
};

export default ReferAndEarnPage;

export const getServerSideProps = async ({ req, res }) => {
  const configResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": req.cookies.languageSetting || "en",
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const configData = await configResponse.json();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate"
  );

  return { props: { configData } };
};
