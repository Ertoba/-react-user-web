// Keep search sorting consistent with the V4.2 search endpoint.
// Do not sort only the currently loaded page: that breaks infinite pagination.
const PRICE_SORT = {
  high: "price_high_low",
  low: "price_low_high",
};
const STORE_SORT = new Set(["fast_delivery", "nearby"]);

export const getSearchSortParam = (currentTab, sortBy, newSort) => {
  if (currentTab === 0) {
    return PRICE_SORT[sortBy] || undefined;
  }
  if (currentTab === 1) {
    return STORE_SORT.has(newSort) ? newSort : undefined;
  }
  return undefined;
};
