import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readSource = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const configFiles = [
  "src/components/home/module-wise-components/food/foodSectionsConfig.js",
  "src/components/home/module-wise-components/grocery/grocerySectionsConfig.js",
  "src/components/home/module-wise-components/pharmacy/pharmacySectionsConfig.js",
  "src/components/home/module-wise-components/ecommerce/ecommerceSectionsConfig.js",
];

test("V4.2 nested /home section reaches the sidebar layout", () => {
  const page = readSource("pages/home/[...slug].tsx");
  const moduleLayout = readSource("src/components/module-wise-layout/index.js");
  const home = readSource("src/components/home/HomePageComponents.js");
  const sidebar = readSource("src/components/home/sidebar-layout/ModuleHomeSidebarLayout.tsx");

  assert.match(page, /routeSection=\{routeSection\s*\?\?\s*undefined\}/);
  assert.match(moduleLayout, /const ModuleWiseLayout\s*=\s*\(\{[^}]*routeSection[^}]*\}\)/);
  assert.match(moduleLayout, /<HomePageComponents[\s\S]*?routeSection=\{routeSection\}/);
  assert.match(moduleLayout, /routeCategory=\{routeCategory\}/);
  assert.match(home, /<Grocery\b[^>]*routeSection=\{routeSection\}/);
  assert.match(home, /<Pharmacy\b[^>]*routeSection=\{routeSection\}/);
  assert.match(home, /<Shop\b[^>]*routeSection=\{routeSection\}/);
  assert.match(home, /routeSection=\{routeSection\}/);
  assert.match(sidebar, /activeSection_\s*=\s*sections\.find\(\(s\)\s*=>\s*s\.id\s*===\s*activeSection\)/);
  assert.match(sidebar, /activeSectionContent\s*\?\?\s*overviewContent/);
});

test("Offers, free delivery and nearby are present in all four modules", () => {
  for (const path of configFiles) {
    const source = readSource(path);
    for (const id of ["offers", "free-delivery", "nearby"]) {
      assert.match(source, new RegExp(`id:\\s*"${id}"`), `${path} lacks ${id}`);
    }
    assert.match(source, /<OffersSectionPage\s*\/>/);
    assert.match(source, /<TabbedSectionPage sectionType="free-delivery"\s*\/>/);
    assert.match(source, /<TabbedSectionPage sectionType="nearby"\s*\/>/);
  }
});

test("Offers uses dedicated V4.2 API routes for items and stores", () => {
  const offers = readSource("src/components/home/section-page/OffersSectionPage.js");
  const itemHook = readSource("src/api-manage/hooks/react-query/offers/useGetOfferItems.js");
  const storeHook = readSource("src/api-manage/hooks/react-query/offers/useGetOfferStores.js");
  const routes = readSource("src/api-manage/ApiRoutes.js");
  assert.match(offers, /useGetOfferItems\(itemParams, fetchItems\)/);
  assert.match(offers, /useGetOfferStores\(storeParams, fetchStores\)/);
  assert.match(routes, /offers_items_api\s*=\s*"\/api\/v1\/offers\/items"/);
  assert.match(routes, /offers_stores_api\s*=\s*"\/api\/v1\/offers\/stores"/);
  assert.match(itemHook, /offers_items_api/);
  assert.match(storeHook, /offers_stores_api/);
});

test("Free delivery and nearby send fixed quick_action to search endpoint", () => {
  const page = readSource("src/components/home/section-page/TabbedSectionPage.js");
  const searchHook = readSource("src/api-manage/hooks/react-query/search/useGetSearchPageData.js");
  const api = readSource("src/api-manage/MainApi.js");
  assert.match(page, /"free-delivery":\s*\{[^}]*quickAction:\s*"free_delivery"/);
  assert.match(page, /nearby:\s*\{[^}]*quickAction:\s*"nearby"/);
  assert.match(page, /quick_action:\s*sectionQuickAction/);
  assert.match(searchHook, /quick_action,\s*store_id,/);
  assert.match(searchHook, /quick_action,\s*store_id:\s*store_id/);
  assert.match(api, /config\.headers\.latitude\s*=\s*currentLocation\?\.lat\s*\|\|\s*0/);
  assert.match(api, /config\.headers\.longitude\s*=\s*currentLocation\?\.lng\s*\|\|\s*0/);
});
