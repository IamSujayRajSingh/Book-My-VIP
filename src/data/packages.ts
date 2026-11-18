import { siteConfig } from "./siteConfig";

/** Public package summaries. See docs/content-review.md before changing an inclusion. */
export interface VipPackage {
  slug: string;
  name: string;
  price: number;
  capacity: number | null;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  inclusions: string[];
  preferredSong: boolean;
  seoTitle: string;
  seoDescription: string;
}

const sharedInclusions = [
  "One fruit platter",
  "One vegetarian platter",
  "One non-vegetarian platter",
  "One chakhna platter",
  "Group photo on the big screen",
];
const baseHighlights = ["Four sharing platters", "Big-screen group photo"];
const songRequest = "One preferred song request";

export const packages: VipPackage[] = [
  {
    slug: "vip-package",
    name: "VIP Package",
    price: 20000,
    capacity: 4,
    description:
      "Settle in with your closest friends. Share four platters at the table and put your group photo up on the big screen.",
    image: "/images/packages/vip-package.webp",
    imageAlt: "Burgundy velvet booth beside a glowing table lamp",
    highlights: [...baseHighlights],
    inclusions: [...sharedInclusions],
    preferredSong: false,
    seoTitle: "VIP Package in Pattaya",
    seoDescription:
      "Explore the VIP Package for a small group in Pattaya, with sharing platters and a big-screen group photo. Ask about your preferred date and final inclusions.",
  },
  {
    slug: "vip-premium",
    name: "VIP Premium",
    price: 30000,
    capacity: 6,
    description:
      "Bring the group together over sharing platters, then request the song that gets everyone on their feet.",
    image: "/images/packages/vip-premium.webp",
    imageAlt: "Violet stage lights crossing above a dance floor",
    highlights: [...baseHighlights, songRequest],
    inclusions: [...sharedInclusions, songRequest],
    preferredSong: true,
    seoTitle: "VIP Premium Package in Pattaya",
    seoDescription:
      "Compare the VIP Premium table package in Pattaya for a group celebration. Explore the food and music details and send a date-specific enquiry.",
  },
  {
    slug: "vip-gold",
    name: "VIP Gold",
    price: 50000,
    capacity: null,
    description:
      "Planning a special occasion? Share your guest count with the concierge to check the table size, cover arrangements and final Gold package.",
    image: "/images/packages/vip-gold.webp",
    imageAlt: "Amber lighting above a curved lounge booth",
    highlights: [...baseHighlights, songRequest],
    inclusions: [...sharedInclusions, songRequest],
    preferredSong: true,
    seoTitle: "VIP Gold Package in Pattaya",
    seoDescription:
      "Plan a Pattaya VIP Gold enquiry for your occasion. Discuss capacity, cover arrangements, sharing platters and the final total with the booking team.",
  },
];

const baht = new Intl.NumberFormat("en-TH", {
  style: "currency",
  currency: siteConfig.currency,
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return baht.format(price);
}

export function capacityLabel(pkg: VipPackage): string {
  return pkg.capacity === null
    ? "Group size on request"
    : `${pkg.capacity} guests`;
}
