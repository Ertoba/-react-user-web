// V4.2 mobile profile subpage headings. Keep these as translation keys.
export const PROFILE_MOBILE_PAGE_TITLES = Object.freeze({
  "profile-settings": "Profile",
  "addresses": "Addresses",
  "my-orders": "Orders & Trips",
  "my-trips": "Orders & Trips",
  "track-order": "Track Orders",
  "wallet": "My Wallet",
  "monthly-cart-list": "Monthly Cart List",
  "coupons": "Available Coupons",
  "loyalty-points": "Loyalty Points",
  "referral-code": "Referral Code",
  "subscription-plan": "Subscription Plan",
  "inbox": "Inbox",
  "settings": "Settings",
  "custom-service": "Custom Service",
  "service-request": "Requested Services",
});

export const getProfileMobileTitle = (page, hasOrderDetails = false) => {
  if (page === "my-orders" && hasOrderDetails) return "Order Details";
  return PROFILE_MOBILE_PAGE_TITLES[page] ?? "Profile";
};
