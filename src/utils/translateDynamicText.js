import i18n from "i18next";

const exactTranslations = {
  "Download the Customer App": "ჩამოტვირთე მომხმარებლის აპი",
  "Smart shopping starts here.": "ჭკვიანი შოპინგი აქ იწყება.",
  "Start Selling with $6amMart$": "დაიწყე გაყიდვა $მილიზე$",
  "Turn your local shop into an online business and grow your sales with our powerful platform":
    "გადააქციე შენი მაღაზია ონლაინ ბიზნესად და გაზარდე გაყიდვები ჩვენი პლატფორმით",
  "Start Selling": "დაიწყე გაყიდვა",
  "Deliver More. $Earn$ More.": "მიიტანე მეტი. $გამოიმუშავე$ მეტი.",
  "Start Earning": "დაიწყე გამომუშავება",
  "Ride Anytime, Anywhere": "იმგზავრე ნებისმიერ დროს, ყველგან",
  "6amMart makes it easy to rent vehicles quickly and affordably.":
    "მილი გაგიმარტივებს ტრანსპორტის სწრაფად და ხელმისაწვდომად ქირაობას.",
  "$6amMart$": "$მილი$",
  "is Best Delivery Service Near You": "არის საუკეთესო მიტანის სერვისი შენთან ახლოს",
  "6amMart is a one-stop shop for all your daily necessities. You can shop for groceries, and pharmacy items, order food, and send important parcels from one place to another from the comfort of your home.":
    "მილი არის ერთი სივრცე ყოველდღიური საჭიროებებისთვის. შეგიძლია შეუკვეთო მარკეტის და აფთიაქის ნივთები, საკვები და ამანათები სახლიდან გაუსვლელად.",
  "Order Now": "შეუკვეთე ახლა",
  "Our Clients": "ჩვენი კლიენტები",
  "Trusted by leading brands for fast and reliable delivery services.":
    "წამყვანი ბრენდები გვანდობენ სწრაფ და საიმედო მიტანას.",
  "How do I place an order?": "როგორ განვათავსო შეკვეთა?",
  "Browse your favorite items, add them to your cart, and confirm checkout — it’s that simple!":
    "დაათვალიერე სასურველი ნივთები, დაამატე კალათაში და დაადასტურე შეკვეთა.",
  "How do I cancel or change my order?": "როგორ გავაუქმო ან შევცვალო შეკვეთა?",
  "You can cancel or modify your order before it’s confirmed by the store.":
    "შეკვეთის გაუქმება ან შეცვლა შეგიძლია მანამდე, სანამ მაღაზია დაადასტურებს.",
  "How can my store join the platform?": "როგორ შემოუერთდეს ჩემი მაღაზია პლატფორმას?",
  "Fill out our partner registration form — our team will contact you for setup.":
    "შეავსე პარტნიორის რეგისტრაციის ფორმა და ჩვენი გუნდი დაგიკავშირდება.",
  "Can I update my menu or prices anytime?": "შემიძლია მენიუს ან ფასების ნებისმიერ დროს განახლება?",
  "Yes, you can easily update items, prices, and availability through your dashboard.":
    "დიახ, ნივთების, ფასებისა და ხელმისაწვდომობის განახლება მარტივად შეგიძლია პანელიდან.",
  "How do I become a delivery partner?": "როგორ გავხდე კურიერი?",
  "Apply through our website or app — submit your details and required documents.":
    "განაცხადი შეავსე ვებსაიტიდან ან აპიდან და ატვირთე საჭირო მონაცემები და დოკუმენტები.",
  "How do I get delivery requests?": "როგორ მივიღო მიტანის მოთხოვნები?",
  "Once online, nearby orders will automatically appear on your driver app.":
    "ონლაინ რეჟიმში გადასვლის შემდეგ ახლომდებარე შეკვეთები ავტომატურად გამოჩნდება კურიერის აპში.",
  "Very good Service.": "ძალიან კარგი სერვისი.",
};

const partialTranslations = [
  [
    "Join 6amMart as a delivery partner and turn every ride into income. Work on your own schedule and get paid faster, every day.",
    "შეუერთდი მილის როგორც კურიერი და ყოველი მიტანა შემოსავლად აქციე. იმუშავე შენი გრაფიკით და მიიღე ანაზღაურება სწრაფად, ყოველდღე.",
  ],
  [
    "Choose your ride &ndash; car, bike, or bicycle",
    "აირჩიე ტრანსპორტი - მანქანა, მოპედი ან ველოსიპედი",
  ],
  [
    "Choose your ride – car, bike, or bicycle",
    "აირჩიე ტრანსპორტი - მანქანა, მოპედი ან ველოსიპედი",
  ],
  [
    "Flexible hours that fit your lifestyle",
    "მოქნილი საათები შენს ცხოვრების წესზე მორგებით",
  ],
  [
    "Instant payouts &amp; bonus opportunities",
    "სწრაფი ანაზღაურება და ბონუსების შესაძლებლობები",
  ],
  [
    "Instant payouts & bonus opportunities",
    "სწრაფი ანაზღაურება და ბონუსების შესაძლებლობები",
  ],
];

export const translateDynamicText = (value) => {
  if (value === null || value === undefined) return value;

  const text = String(value);
  const exact = exactTranslations[text];
  if (exact) return exact;

  const translated = i18n.t(text);
  if (translated && translated !== text) return translated;

  return partialTranslations.reduce(
    (acc, [source, target]) => acc.replaceAll(source, target),
    text
  );
};
