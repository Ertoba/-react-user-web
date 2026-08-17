import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const listOfObjects = (value) =>
  Array.isArray(value)
    ? value.filter((item) => item && typeof item === "object")
    : [];

const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatMoney = (value, currency) => {
  const amount = numberValue(value).toFixed(2);
  const symbol = String(currency?.symbol ?? "").trim();
  return currency?.position === "right"
    ? `${amount} ${symbol}`.trim()
    : `${symbol} ${amount}`.trim();
};

const SectionHeading = ({ icon, title }) => (
  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
    {icon}
    <Typography variant="subtitle2" fontWeight={700}>
      {title}
    </Typography>
  </Stack>
);

const ProductCard = ({ product, currency, onAskAbout }) => {
  const { t } = useTranslation();
  const price = numberValue(product?.price);
  const discountedPrice = numberValue(product?.discounted_price);
  const hasDiscount = Boolean(product?.has_discount) && discountedPrice < price;
  const inStock = product?.in_stock !== false;

  return (
    <Card
      variant="outlined"
      sx={{
        width: 276,
        minWidth: 276,
        height: 142,
        borderRadius: "8px",
        boxShadow: "none",
      }}
    >
      <CardActionArea
        aria-label={String(product?.name ?? t("Items"))}
        onClick={() => onAskAbout(String(product?.name ?? ""))}
        sx={{ height: "100%", p: 1.25 }}
      >
        <Stack direction="row" spacing={1.25} sx={{ height: "100%" }}>
          <Box
            component="img"
            src={product?.image_full_url || "/static/no-image-found.png"}
            alt=""
            sx={{
              width: 88,
              height: 88,
              flexShrink: 0,
              objectFit: "cover",
              borderRadius: "6px",
              bgcolor: "action.hover",
            }}
          />
          <Stack minWidth={0} flex={1}>
            <Typography variant="subtitle2" fontWeight={700} noWrap={false}>
              <Box
                component="span"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {product?.name}
              </Box>
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {product?.store_name}
            </Typography>
            <Box flex={1} />
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <StarRoundedIcon sx={{ fontSize: 17, color: "#F4A62A" }} />
              <Typography variant="caption">
                {numberValue(product?.rating).toFixed(1)}
              </Typography>
              <Box flex={1} />
              <Chip
                size="small"
                label={t(inStock ? "In Stock" : "Out of Stock")}
                color={inStock ? "success" : "error"}
                variant="outlined"
                sx={{ height: 22, "& .MuiChip-label": { px: 0.75 } }}
              />
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="baseline">
              <Typography variant="subtitle2" color="primary" fontWeight={700}>
                {formatMoney(discountedPrice, currency)}
              </Typography>
              {hasDiscount && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  {formatMoney(price, currency)}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

const StoreCard = ({ store, currency, onAskAbout }) => {
  const { t } = useTranslation();
  return (
    <Card
      variant="outlined"
      sx={{
        width: 286,
        minWidth: 286,
        height: 116,
        borderRadius: "8px",
        boxShadow: "none",
      }}
    >
      <CardActionArea
        aria-label={String(store?.name ?? t("Stores"))}
        onClick={() => onAskAbout(String(store?.name ?? ""))}
        sx={{ height: "100%", p: 1.25 }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar
            src={store?.logo_full_url || undefined}
            alt=""
            variant="rounded"
            sx={{ width: 72, height: 72, bgcolor: "action.hover" }}
          />
          <Stack minWidth={0} flex={1} spacing={0.35}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {store?.name}
            </Typography>
            <Stack direction="row" spacing={0.4} alignItems="center">
              <StarRoundedIcon sx={{ fontSize: 17, color: "#F4A62A" }} />
              <Typography variant="caption">
                {numberValue(store?.rating).toFixed(1)}
              </Typography>
              {store?.delivery_time && (
                <>
                  <ScheduleOutlinedIcon
                    color="disabled"
                    sx={{ ml: 0.75, fontSize: 15 }}
                  />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {store.delivery_time}
                  </Typography>
                </>
              )}
            </Stack>
            <Typography variant="caption" color="primary" noWrap>
              {store?.free_delivery
                ? t("Free Delivery")
                : `${t("Minimum Order")}: ${formatMoney(
                    store?.minimum_order,
                    currency
                  )}`}
            </Typography>
          </Stack>
          <ChevronRightIcon color="action" />
        </Stack>
      </CardActionArea>
    </Card>
  );
};

const HorizontalResults = ({ children }) => (
  <Stack
    direction="row"
    spacing={1}
    sx={{ overflowX: "auto", pb: 0.75, scrollSnapType: "x proximity" }}
  >
    {children}
  </Stack>
);

const AiChatResultSections = ({ metadata = {}, onAskAbout }) => {
  const { t } = useTranslation();
  const products = listOfObjects(metadata?.products);
  const stores = listOfObjects(metadata?.stores);
  const categories = listOfObjects(metadata?.categories);

  if (!products.length && !stores.length && !categories.length) return null;

  return (
    <Stack spacing={1.25} sx={{ mt: 1, width: "100%" }}>
      {products.length > 0 && (
        <Box>
          <SectionHeading
            icon={<Inventory2OutlinedIcon color="primary" fontSize="small" />}
            title={t("Items")}
          />
          <HorizontalResults>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={metadata.currency}
                onAskAbout={onAskAbout}
              />
            ))}
          </HorizontalResults>
        </Box>
      )}
      {stores.length > 0 && (
        <Box>
          <SectionHeading
            icon={<StorefrontOutlinedIcon color="primary" fontSize="small" />}
            title={t("Stores")}
          />
          <HorizontalResults>
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                currency={metadata.currency}
                onAskAbout={onAskAbout}
              />
            ))}
          </HorizontalResults>
        </Box>
      )}
      {categories.length > 0 && (
        <Box>
          <SectionHeading
            icon={<CategoryOutlinedIcon color="primary" fontSize="small" />}
            title={t("Categories")}
          />
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.75}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                avatar={
                  category?.image_full_url ? (
                    <Avatar src={category.image_full_url} alt="" />
                  ) : undefined
                }
                label={category.name}
                variant="outlined"
                onClick={() => onAskAbout(String(category?.name ?? ""))}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default AiChatResultSections;
