import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CustomContainer from "../../src/components/container";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";

const steps = [
  "გახსენით „მილი“ აპლიკაცია ან mili.ge და შედით ანგარიშში რეგისტრირებული ტელეფონის ნომრითა და ერთჯერადი SMS კოდით (OTP).",
  "გადადით პროფილის გვერდზე და გახსენით პროფილის პარამეტრები.",
  "დააჭირეთ სამწერტილიან მენიუს და აირჩიეთ „ანგარიშის წაშლა“.",
  "გაეცანით გაფრთხილებას და დაადასტურეთ ანგარიშის სამუდამოდ წაშლა.",
];

const deletedData = [
  "ანგარიში და პროფილის მონაცემები — სახელი, ტელეფონის ნომერი, ელფოსტა და პროფილის ფოტო, თუ მითითებული იყო;",
  "შენახული მისამართები, პროფილის პარამეტრები და რჩეული მონაცემები;",
  "ავტორიზაციის სესიები, მოწყობილობასთან დაკავშირებული push-შეტყობინებების ტოკენები და ანგარიშთან მიბმული სხვა ტექნიკური იდენტიფიკატორები;",
  "ანგარიშთან დაკავშირებული სხვა პერსონალური მონაცემები, რომელთა შენახვის სამართლებრივი საფუძველი აღარ არსებობს.",
];

const retainedData = [
  "შეკვეთის, ტრანზაქციის, გადახდის, ბუღალტრული და საგადასახადო ჩანაწერები, როდესაც მათი შენახვა კანონით არის მოთხოვნილი;",
  "თაღლითობის პრევენციის, უსაფრთხოების, დავის, მოთხოვნის ან სამართლებრივი დაცვისთვის აუცილებელი ჩანაწერები.",
];

const SectionCard = ({ icon, title, children }) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      borderRadius: 3,
      borderColor: "divider",
      boxShadow: "none",
    }}
  >
    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography component="h2" variant="h5" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      {children}
    </CardContent>
  </Card>
);

const AccountDeletionPage = ({ configData }) => {
  const businessName = configData?.business_name || "მილი";
  const description =
    "ინსტრუქცია „მილი“ აპლიკაციის ანგარიშისა და მასთან დაკავშირებული პერსონალური მონაცემების წაშლისთვის.";

  return (
    <>
      <CssBaseline />
      <SEO
        title={`ანგარიშისა და მონაცემების წაშლა — ${businessName}`}
        description={description}
        image={configData?.logo_full_url}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <CustomContainer>
          <Box sx={{ py: { xs: 3, md: 6 }, minHeight: "75vh" }}>
            <Box
              sx={{
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                mb: 3,
                color: "common.white",
                background: "linear-gradient(135deg, #006b3c 0%, #00a85a 100%)",
              }}
            >
              <Stack spacing={2.25} maxWidth={850}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label="მობილური აპლიკაცია: მილი"
                    sx={{
                      bgcolor: "rgba(255,255,255,.16)",
                      color: "common.white",
                    }}
                  />
                  <Chip
                    label="Package: ge.mili.customer"
                    sx={{
                      bgcolor: "rgba(255,255,255,.16)",
                      color: "common.white",
                    }}
                  />
                </Stack>
                <Typography
                  component="h1"
                  variant="h3"
                  fontWeight={800}
                  sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                >
                  ანგარიშისა და მონაცემების წაშლა
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ opacity: 0.95, lineHeight: 1.7 }}
                >
                  აქ შეგიძლიათ გაეცნოთ, როგორ წაშალოთ „მილი“ ანგარიში
                  აპლიკაციიდან ან მოითხოვოთ მისი წაშლა ვებგვერდის საშუალებით.
                  ორივე გზა იწვევს ანგარიშის და მასთან დაკავშირებული მონაცემების
                  წაშლას, გარდა კანონით შესანახი ჩანაწერებისა.
                </Typography>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <SectionCard
                  icon={<DeleteOutlineRoundedIcon />}
                  title="ანგარიშის წაშლა აპლიკაციიდან"
                >
                  <Stack spacing={2.25}>
                    {steps.map((step, index) => (
                      <Stack
                        key={step}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography lineHeight={1.7}>{step}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
                    ანგარიშის წაშლა შეუქცევადია. წაშლის შემდეგ იმავე ანგარიშის
                    ისტორიისა და პროფილის აღდგენა შეუძლებელია.
                  </Alert>
                </SectionCard>
              </Grid>

              <Grid item xs={12} md={5}>
                <SectionCard
                  icon={<AlternateEmailRoundedIcon />}
                  title="მოთხოვნა ვებგვერდიდან"
                >
                  <Typography lineHeight={1.75} mb={2}>
                    თუ აპლიკაციაში შესვლა არ შეგიძლიათ, გამოგვიგზავნეთ ანგარიშის
                    წაშლის მოთხოვნა:
                  </Typography>
                  <Button
                    component="a"
                    href="mailto:privacy@mili.ge?subject=MILI%20%E2%80%94%20%E1%83%90%E1%83%9C%E1%83%92%E1%83%90%E1%83%A0%E1%83%98%E1%83%A8%E1%83%98%E1%83%A1%20%E1%83%AC%E1%83%90%E1%83%A8%E1%83%9A%E1%83%90"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<AlternateEmailRoundedIcon />}
                    sx={{ py: 1.25, textTransform: "none", fontWeight: 700 }}
                  >
                    privacy@mili.ge
                  </Button>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    წერილის თემაში მიუთითეთ „ანგარიშის წაშლა“, ხოლო ტექსტში —
                    ანგარიშზე რეგისტრირებული ტელეფონის ნომერი და, თუ გაქვთ
                    მითითებული, სახელი ან ელფოსტა. ანგარიშის მფლობელობას
                    უსაფრთხო მეთოდით გადავამოწმებთ.
                  </Typography>
                  <Alert
                    icon={<LockOutlinedIcon />}
                    severity="info"
                    sx={{ mt: 2.5, borderRadius: 2 }}
                  >
                    არასოდეს გამოგვიგზავნოთ OTP კოდი, პაროლი ან საბანკო ბარათის
                    მონაცემები.
                  </Alert>
                </SectionCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <SectionCard
                  icon={<CheckCircleOutlineRoundedIcon />}
                  title="რა მონაცემები წაიშლება"
                >
                  <Stack component="ul" spacing={1.5} sx={{ pl: 2.5, m: 0 }}>
                    {deletedData.map((item) => (
                      <Typography component="li" key={item} lineHeight={1.7}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </SectionCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <SectionCard
                  icon={<InfoOutlinedIcon />}
                  title="რა შეიძლება დარჩეს შენახული"
                >
                  <Typography lineHeight={1.7} mb={1.5}>
                    მხოლოდ აუცილებელი მინიმალური ჩანაწერები შეიძლება შევინახოთ:
                  </Typography>
                  <Stack component="ul" spacing={1.5} sx={{ pl: 2.5, m: 0 }}>
                    {retainedData.map((item) => (
                      <Typography component="li" key={item} lineHeight={1.7}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    ასეთი მონაცემები აღარ გამოიყენება მარკეტინგისთვის და ინახება
                    მხოლოდ შესაბამისი სამართლებრივი მიზნისა და ვადის
                    განმავლობაში; შემდეგ იშლება ან ანონიმდება.
                  </Typography>
                </SectionCard>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 3,
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 3,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <PersonOutlineRoundedIcon color="primary" sx={{ mt: 0.35 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      მოთხოვნის დამუშავების ვადა
                    </Typography>
                    <Typography color="text.secondary" lineHeight={1.7}>
                      მოთხოვნა შესრულდება ან უარის სამართლებრივი საფუძველი
                      გეცნობებათ არაუგვიანეს 10 სამუშაო დღისა. საჭიროების
                      შემთხვევაში დაგიკავშირდებით ანგარიშის მფლობელობის
                      დასადასტურებლად.
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="body2"
                color="text.secondary"
                lineHeight={1.7}
              >
                პერსონალური მონაცემების დამუშავების, შენახვის ვადებისა და თქვენი
                უფლებების სრული აღწერა იხილეთ{" "}
                <Link href="/privacy-policy" color="primary" fontWeight={700}>
                  კონფიდენციალურობის პოლიტიკაში
                </Link>
                . მონაცემთა მაკონტროლებელია ი/მ „მილი“ (ს/კ 22001011685).
                მონაცემთა დაცვის საკითხებზე შეგიძლიათ მოგვწეროთ{" "}
                <Link
                  href="mailto:dpo@mili.ge"
                  color="primary"
                  fontWeight={700}
                >
                  dpo@mili.ge
                </Link>
                .
              </Typography>
            </Box>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default AccountDeletionPage;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "privacy_policy_page");
};
