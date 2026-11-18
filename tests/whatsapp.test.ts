import assert from "node:assert/strict";
import test from "node:test";
import { inquiryUrl, pattayaDate, validInquiry } from "../src/lib/whatsapp";
import { packages, formatPrice, capacityLabel } from "../src/data/packages";

const beforeMidnight = new Date("2026-11-18T16:59:59.999Z");
const midnight = new Date("2026-11-18T17:00:00Z");

test("Pattaya calendar day changes at midnight UTC+7", () => {
  assert.equal(pattayaDate(beforeMidnight), "2026-11-18");
  assert.equal(pattayaDate(midnight), "2026-11-19");
  assert.equal(validInquiry("2026-11-18", 4, beforeMidnight), true);
  assert.equal(validInquiry("2026-11-18", 4, midnight), false);
});
test("requires a real date and positive whole number of guests", () => {
  for (const date of ["", "tomorrow", "2027-02-29", "2027-13-01"])
    assert.equal(validInquiry(date, 1, midnight), false);
  for (const count of [0, -1, 1.5, NaN, Infinity])
    assert.equal(validInquiry("2026-12-31", count, midnight), false);
  assert.equal(validInquiry("2028-02-29", 7, midnight), true);
});
test("each package matches the supplied price and capacity", () => {
  assert.deepEqual(
    packages.map((p) => [p.price, p.capacity, p.preferredSong]),
    [
      [20000, 4, false],
      [30000, 6, true],
      [50000, null, true],
    ],
  );
  assert.equal(capacityLabel(packages[2]), "Group size on request");
});
test("package enquiries use the official number and matching package and price", () => {
  for (const pkg of packages) {
    const url = new URL(inquiryUrl(pkg));
    assert.equal(url.origin + url.pathname, "https://wa.me/66834691637");
    const message = url.searchParams.get("text")!;
    assert.ok(message.includes(pkg.name));
    assert.ok(message.includes(formatPrice(pkg.price)));
    assert.ok(message.includes("final total price"));
  }
});
test("Unicode, line breaks and special characters round-trip without altering the URL", () => {
  const requests = "Birthday & reunion #1 + friends\nโต๊ะ VIP?";
  const url = new URL(
    inquiryUrl(packages[1], {
      date: "2027-01-20",
      guests: 7,
      time: "22:15",
      name: "  Zoë  ",
      venue: "A & B",
      requests,
    }),
  );
  const message = url.searchParams.get("text")!;
  assert.deepEqual([...url.searchParams.keys()], ["text"]);
  for (const item of [
    requests,
    "Name: Zoë",
    "Preferred Venue: A & B",
    "22:15",
    "2027-01-20",
    "Number of Guests: 7",
  ])
    assert.ok(message.includes(item));
  assert.equal(url.hash, "");
});
test("general and minimal messages omit unselected and empty fields", () => {
  assert.ok(
    !new URL(inquiryUrl()).searchParams.get("text")!.includes("Package:"),
  );
  const message = new URL(
    inquiryUrl(packages[2], { date: "2027-05-01", guests: 3, name: "  " }),
  ).searchParams.get("text")!;
  assert.doesNotMatch(
    message,
    /Name:|Arrival Time|Special Requests:|Preferred Venue:|undefined|null/,
  );
});
