import { Typography, useMediaQuery, useTheme,NoSsr } from '@mui/material'
import { t } from 'i18next';
import React from 'react'
import { CustomStackFullWidth } from '../../styled-components/CustomStyles.style';

const FooterBottomItems = ({ configData,handleClickToRoute }) => {
    const theme = useTheme();
    const isXsmall = useMediaQuery(theme.breakpoints.down("sm"));
    const formatFooterLink = (text) =>
        isXsmall ? t(text).toLocaleUpperCase("ka-GE") : t(text);
    const footerLinkSx = {
        cursor: "pointer",
        fontSize: { xs: "11px", sm: "inherit" },
        lineHeight: { xs: 1.35, sm: "normal" },
        fontWeight: { xs: 600, sm: "inherit" },
        letterSpacing: 0,
        flex: { xs: "0 0 calc(50% - 8px)", sm: "initial" },
        "&:hover": {
            color: theme.palette.primary.main,
        },
    };
    return (
        <NoSsr>
        <CustomStackFullWidth
            direction="row"
            spacing={{ xs: 0, sm: 2, md: 3 }}
            alignItems={{ xs: "flex-start", sm:"center"}}
            justifyContent={{xs:"flex-start", sm:"flex-end"}}
            sx={{
                flexWrap: { xs: "wrap", sm: "nowrap" },
                columnGap: { xs: "16px", sm: 0 },
                rowGap: { xs: "10px", sm: 0 },
            }}
        >
            <Typography
                onClick={() => handleClickToRoute("/terms-and-conditions")}
                sx={footerLinkSx}
            >
                {formatFooterLink("Terms & Conditions")}
            </Typography>
            <Typography
                onClick={() => handleClickToRoute("/privacy-policy")}
                sx={footerLinkSx}
            >
                {formatFooterLink("Privacy Policy")}
            </Typography>
            {configData?.refund_policy !== 0 && (
                <Typography
                    onClick={() => handleClickToRoute("/refund-policy")}
                    sx={footerLinkSx}
                >
                    {formatFooterLink("Refund Policy")}
                </Typography>
            )}
            {configData?.cancelation_policy !== 0 && (
                <Typography
                    onClick={() => handleClickToRoute("/cancellation-policy")}
                    sx={footerLinkSx}
                >
                    {formatFooterLink("Cancellation Policy")}
                </Typography>
            )}
            {configData?.shipping_policy !== 0 && (
                <Typography
                    onClick={() => handleClickToRoute("/shipping-policy")}
                    sx={footerLinkSx}
                >
                    {formatFooterLink("Shipping Policy")}
                </Typography>
            )}
        </CustomStackFullWidth>
        </NoSsr>
    )
}

export default FooterBottomItems
