import { siteConfig } from "../data/siteConfig";
import { formatPrice, type VipPackage } from "../data/packages";

export interface Inquiry {
  date: string;
  guests: number;
  time?: string;
  venue?: string;
  name?: string;
  requests?: string;
}

export function pattayaDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: siteConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((key) => parts.find((part) => part.type === key)?.value)
    .join("-");
}

export function validInquiry(
  date: string,
  guests: number,
  now = new Date(),
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < pattayaDate(now))
    return false;
  const day = new Date(date + "T00:00:00Z");
  return (
    Number.isFinite(day.valueOf()) &&
    day.toISOString().slice(0, 10) === date &&
    Number.isSafeInteger(guests) &&
    guests > 0
  );
}

export function inquiryUrl(pkg?: VipPackage, details?: Inquiry): string {
  const lines = [
    "Hello Book My VIP!",
    "",
    "I would like to enquire about a VIP table in Pattaya.",
  ];
  if (pkg)
    lines.push(
      "Package: " + pkg.name,
      "Package Price: " + formatPrice(pkg.price),
    );
  if (details) {
    lines.push(
      "Preferred Date (Pattaya): " + details.date,
      "Number of Guests: " + details.guests,
    );
    for (const [label, value] of [
      ["Preferred Arrival Time (Pattaya)", details.time],
      ["Preferred Venue", details.venue],
      ["Name", details.name],
      ["Special Requests", details.requests],
    ]) {
      if (value?.trim()) lines.push(label + ": " + value.trim());
    }
  }
  lines.push(
    "",
    "Please confirm availability, the venue, applicable package inclusions, final total price, and the steps required to confirm the reservation.",
    "",
    "Thank you!",
  );
  const url = new URL(siteConfig.whatsappUrl);
  url.searchParams.set("text", lines.join("\n"));
  return url.href;
}
