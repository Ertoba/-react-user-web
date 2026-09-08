import fs from 'node:fs';
export const config = JSON.parse(fs.readFileSync(new URL('./fixtures/config.json', import.meta.url)));
export const landing = JSON.parse(fs.readFileSync(new URL('./fixtures/landing.json', import.meta.url)));
export const picture = 'http://127.0.0.1:4319/fixture.svg';
export const module = { id: 1, slug: 'grocery', module_name: 'მარკეტი', module_type: 'grocery', icon_full_url: picture, thumbnail_full_url: picture, status: '1', stores_count: 2, all_zone_service: 0 };
export const category = { id: 1, name: 'ახალი პროდუქტები', image_full_url: picture, parent_id: 0, childes: [], module_id: 1 };
export const store = {
  id: 1, slug: 'qa-store', name: 'სატესტო მაღაზია გრძელი ქართული დასახელებით', module_id: 1, module_type: 'grocery', zone_id: 1,
  logo: 'fixture.svg', cover_photo: 'fixture.svg', logo_full_url: picture, cover_photo_full_url: picture,
  address: 'თბილისი, სატესტო ქუჩა 123', latitude: '41.7151', longitude: '44.8271', phone: '+995555000000',
  active: true, open: 1, status: 1, minimum_order: 10, minimum_shipping_charge: 3, maximum_shipping_charge: 8,
  delivery_time: '20-30 min', avg_rating: 4.8, rating_count: 20, rating: [0, 0, 1, 4, 15],
  free_delivery: false, delivery: true, take_away: true, schedule_order: true, discount: null,
  categories: [category], schedules: Array.from({ length: 7 }, (_, day) => ({ day, opening_time: '00:00:00', closing_time: '23:59:59' })),
  current_opening_time: '00:00:00', current_closing_time: '23:59:59', gst_status: false, gst_code: '',
  tax: 0, tax_status: false, delivery_charge: 3, self_delivery_system: 0, meta_title: 'სატესტო მაღაზია', positive_rating: 100,
};
export const item = {
  id: 1, slug: 'qa-product', name: 'ქართული პროდუქტი ძალიან გრძელი დასახელებით', description: 'სატესტო პროდუქტის აღწერა. შემადგენლობა და დამატებითი ინფორმაცია ქართულად.',
  image: 'fixture.svg', image_full_url: picture, images: [], images_full_url: [picture], price: 12.5,
  discount: 0, discount_type: 'percent', avg_rating: 4.8, rating_count: 20, rating: [0, 0, 1, 4, 15],
  store_id: 1, store_name: store.name, store: store, module_id: 1, module_type: 'grocery', category_id: 1, category_ids: [{ id: '1', position: 1 }],
  stock: 50, maximum_cart_quantity: 10, unit: { id: 1, unit: 'ცალი' }, unit_type: 'ცალი', organic: 0, veg: 1, halal: 1,
  available_time_starts: '00:00:00', available_time_ends: '23:59:59', variations: [], food_variations: [], choice_options: [], attributes: [], add_ons: [],
  tags: [], nutritions: [], allergies: [], is_campaign: 0, quantity: 1, prescription: 0,
};
export const profile = { id: 1, f_name: 'სატესტო', l_name: 'მომხმარებელი', email: 'qa@example.test', phone: '+995555000000', image_full_url: picture, wallet_balance: 50, loyalty_point: 100, order_count: 2, ref_code: 'QAONLY', is_phone_verified: 1 };
export const address = { id: 1, address_type: 'home', contact_person_name: 'სატესტო მომხმარებელი', contact_person_number: '+995555000000', address: store.address, latitude: store.latitude, longitude: store.longitude, zone_ids: [1], zone_id: 1, road: 'სატესტო', house: '123', floor: '2' };
export const cartItem = { id: 1, item_id: 1, item_type: 'App\\Models\\Item', item: item, item_details: item, quantity: 1, price: 12.5, variation: [], add_on_ids: [], add_on_qtys: [], add_ons: [] };
export const order = { id: 1, user_id: 1, store_id: 1, store: store, order_amount: 15.5, order_status: 'confirmed', order_type: 'delivery', payment_status: 'unpaid', payment_method: 'cash_on_delivery', delivery_charge: 3, delivery_address: address, details_count: 1, created_at: '2026-09-06T10:00:00.000000Z', updated_at: '2026-09-06T10:00:00.000000Z', module_type: 'grocery', module_id: 1, delivery_man: null, tax_status: 'excluded', total_tax_amount: 0 };
const list = (key, values = []) => ({ total_size: values.length, limit: 10, offset: 1, [key]: values });

// Explicit local responses. Missing contracts return 501 and are recorded by the audit.
export function responseFor(path, method, search = new URLSearchParams()) {
  if (path === '/api/v1/config') return config;
  if (path === '/api/v1/config/get-analytic-scripts') return [];
  if (path === '/api/v1/rental/vehicle/category-list') return { vehicles: [] };
  if (path === '/api/v1/react-landing-page') return landing;
  if (path === '/api/v1/get-page-meta-data') return { title: 'MILI — სატესტო გვერდი', description: 'ქართული ინტერფეისის შემოწმება', image_full_url: picture, meta_data: null };
  if (path === '/api/v1/module') return [module];
  if (path === '/api/v1/customer/info') return profile;
  if (path === '/api/v1/auth/guest/request') return { guest_id: 1 };
  if (path === '/api/v1/customer/order/get-Tax') return { tax_amount: 0, tax_included: 0, tax_status: 'excluded' };
  if (path === '/api/v1/customer/order/get-surge-price') return { price: 0, price_type: 'amount', customer_note_status: 0, customer_note: '' };
  if (path === '/api/v1/vehicle/extra_charge') return 0;
  if (path === '/api/v1/cancelation') return { content: '<p>სატესტო გაუქმების პირობები</p>' };
  if (path === '/api/v1/items/common-conditions') return [];
  if (/^\/api\/v1\/banners\/\d+$/.test(path)) return [];
  if (path === '/api/v1/config/get-zone-id') return { zone_id: '[1]', zone_data: [{ id: 1, name: 'თბილისი', cash_on_delivery: true, digital_payment: false, modules: [{ id: 1, minimum_shipping_charge: 3, maximum_shipping_charge: 8, per_km_shipping_charge: 1 }] }] };
  if (path === '/api/v1/zone/list') return [{ id: 1, name: 'თბილისი', modules: [module] }];
  if (path === '/api/v1/zone/check') return { status: true };
  if (path === '/api/v1/config/distance-api') return { rows: [{ elements: [{ status: 'OK', distance: { value: 2000, text: '2 km' }, duration: { value: 600, text: '10 min' } }] }], status: 'OK' };
  if (/\/stores\/details\//.test(path)) return store;
  if (/\/items\/details\//.test(path)) return item;
  if (path === '/api/v1/customer/cart/list') return [cartItem];
  if (path === '/api/v1/customer/address/list') return list('addresses', [address]);
  if (path === '/api/v1/customer/wish-list') return { item: [item], store: [store] };
  if (path === '/api/v1/customer/order/details') return [{ id: 1, item_details: item, quantity: 1, price: 12.5, variation: [], add_ons: [], discount_on_item: 0, total_add_on_price: 0 }];
  if (path === '/api/v1/customer/order/track') return order;
  if (path === '/api/v1/customer/order/list' || path === '/api/v1/customer/order/running-orders' || path === '/api/v1/customer/order') return list('orders', [order]);
  if (path === '/api/v1/customer/order/payment-failed' || path === '/api/v1/customer/review-reminder') return null;
  if (path === '/api/v1/customer/message/list') return list('conversations');
  if (path === '/api/v1/customer/message/details') return list('messages');
  if (path === '/api/v1/customer/wallet/transactions' || path === '/api/v1/customer/loyalty-point/transactions') return list('data');
  if (/\/categories(?:\/childes\/\d+)?$/.test(path)) return [category];
  if (path === '/api/v1/brand') return list('brands', [{ id: 1, name: 'სატესტო ბრენდი', image_full_url: picture }]);
  if (/\/items\/(?:related-items|related-store-items)/.test(path)) return [item];
  if (/\/items\/(?:popular|latest|most-reviewed|new-arrival|discounted|recommended|search)/.test(path) || /\/categories\/items\//.test(path)) return list('products', [item]);
  if (/\/stores\/(?:popular|latest|top-rated|discounted|get-stores|top-offer-near-me|recommended)/.test(path) || /\/categories\/stores\//.test(path) || /^\/api\/v1\/stores\/(?:all|delivery|takeaway)$/.test(path)) return list('stores', [store]);
  if (path === '/api/v1/get-combined-data') return { items: [item], stores: [store], categories: [category] };
  if (path === '/api/v1/banners') return { banners: [], campaigns: [] };
  if (path === '/api/v1/other-banners') return [];
  if (path === '/api/v1/flash-sales') return { active: false, products: [], items: [], flash_sale: null };
  if (path === '/api/v1/flash-sales/items') return list('products');
  if (path === '/api/v1/campaigns/basic-campaign-details') return { id: 1, title: 'სატესტო კამპანია', description: item.description, image_full_url: picture, stores: [store] };
  if (path === '/api/v1/campaigns/item') return [];
  if (path === '/api/v1/campaigns/basic') return [{ id: 1, title: 'სატესტო კამპანია', image_full_url: picture }];
  if (/^\/api\/v1\/(?:advertisement\/list|testimonial|common-condition|coupon\/list|offline_payment_method_list|customer\/automated-message|customer\/order\/refund-reasons|customer\/order\/parcel-instructions|customer\/wallet\/bonuses|cashback\/list|most-tips|get-vehicles|parcel-category|vendor\/package-view)$/.test(path)) return [];
  if (path === '/api/v1/customer/visit-again' || path === '/api/v1/customer/suggested-items') return list('items', [item]);
  if (/\/items\/reviews\//.test(path) || path === '/api/v1/stores/reviews') return [];
  if (/^\/api\/v1\/(?:about-us|terms-and-conditions|privacy-policy|refund-policy|shipping-policy|cancellation-policy)$/.test(path)) return { content: '<h2>სატესტო სათაური</h2><p>ეს არის მხოლოდ ლოკალური ინტერფეისის შესამოწმებელი ტექსტი.</p>' };
  return undefined;
}

export function storageSeed() {
  const persisted = {
    utilsData: JSON.stringify({ selectedModule: module, orderType: 0, currentTab: '', orderInformation: {}, welcomeModal: false }),
    cart: JSON.stringify({ cartList: [{ ...item, cartItemId: 1, itemBasePrice: 12.5, totalPrice: 12.5, selectedAddons: [], selectedOptions: [] }], campaignItemList: [], buyNowItemList: [], totalAmount: 12.5 }),
    profileInfo: JSON.stringify({ profileInfo: profile }),
    _persist: JSON.stringify({ version: -1, rehydrated: true }),
  };
  return { appVersion: 'local-qa', token: 'local-qa-token-no-production-access', 'language-setting': JSON.stringify('ka'), settings: JSON.stringify({ direction: 'ltr', theme: 'light', responsiveFontSizes: true }), module: JSON.stringify(module), selectedModuleIdentifier: 'grocery', selectedModuleId: '1', zoneid: '[1]', location: address.address, currentLatLng: JSON.stringify({ lat: 41.7151, lng: 44.8271 }), 'persist:sixam-mart': JSON.stringify(persisted) };
}
