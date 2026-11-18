const whatsappNumber = "66834691637";
const instagramHandle = "bookmyvip";

export const siteConfig = {
  businessName: "Book My VIP",
  city: "Pattaya",
  country: "Thailand",
  currency: "THB",
  timezone: "Asia/Bangkok",
  whatsappNumber,
  whatsappDisplay: "+66 83 469 1637",
  whatsappUrl: `https://wa.me/${whatsappNumber}`,
  instagramUrl: `https://www.instagram.com/${instagramHandle}`,
  instagramHandle: `@${instagramHandle}`,
} as const;
