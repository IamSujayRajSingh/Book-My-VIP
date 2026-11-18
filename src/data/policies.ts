import { siteConfig } from "./siteConfig";

interface Policy {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; body: string }[];
}

const contact = `For questions about your enquiry, contact Book My VIP on WhatsApp at ${siteConfig.whatsappDisplay}. If you have an existing booking, reply in the same conversation.`;

export const policies: Policy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "Draft privacy notice covering the Pattaya enquiry form, WhatsApp conversations and optional site analytics. Pending owner and local legal review.",
    sections: [
      {
        heading: "Entering your enquiry",
        body: "Your browser uses your selected package, date and guest count to prepare a draft message. Adding your name, preferred venue, arrival time or special requests is optional. Only include details you are comfortable sharing in a WhatsApp conversation.",
      },
      {
        heading: "Opening WhatsApp",
        body: "Opening the link passes your draft to WhatsApp in the link address. You can edit the draft before sending it. Once you send it, the team can use your message and WhatsApp contact details to discuss your request. WhatsApp handles its service under its own privacy policy.",
      },
      {
        heading: "Availability checks",
        body: "Checking availability may require sharing your date, group size and requests with a venue. Ask the team which details a venue needs before sharing additional personal information. Keep identity documents and payment card details out of the enquiry form.",
      },
      {
        heading: "Website usage and external links",
        body: "The hosting provider processes technical requests to deliver these pages. If optional analytics is enabled and you accept it, the site can measure visits and actions such as package selection or opening a WhatsApp enquiry. Enquiry names, dates and free-text requests are excluded from those event details. Instagram and WhatsApp apply their own terms when you visit them.",
      },
      {
        heading: "Questions about your information",
        body: `To ask about access, correction or deletion of information you shared, message ${siteConfig.whatsappDisplay} on WhatsApp. Describe the conversation using only the detail needed to locate it.`,
      },
      {
        heading: "Pending review",
        body: "The owner and local adviser need to verify the responsible operator, lawful uses, retention periods, service providers, recipients, international transfers and procedures for handling privacy requests before publication.",
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms and Conditions",
    description:
      "Draft terms for using Book My VIP to enquire about Pattaya nightclub tables, review package information and discuss venue arrangements.",
    sections: [
      {
        heading: "Our role",
        body: "Book My VIP helps guests compare Pattaya nightlife packages and discuss a table reservation with the booking team. The team checks the proposed arrangements with the venue.",
      },
      {
        heading: "Package information and pricing",
        body: "The site presents selected package inclusions and prices in Thai baht. Request a written summary of the venue, table arrangements, complete inclusions and final total before deciding. The number of guests, the date or a special request may affect what a venue can offer.",
      },
      {
        heading: "Admission and venue operations",
        body: "The venue manages admission, identification checks, on-site services and house rules. Guests should be at least 20 and bring the government-issued photo identification accepted by their venue. Check dress requirements, arrival time and any accessibility needs in advance.",
      },
      {
        heading: "Your responsibilities",
        body: "Share accurate reservation details, follow the venue’s rules and let the team know when your plans change. Get each guest’s permission before sharing their information or asking to display a group photo. Plan safe transport home.",
      },
      {
        heading: "Questions and draft status",
        body: `${contact} The business owner and a local adviser must review the operator details, consumer terms and responsibilities of the parties before these draft terms are adopted.`,
      },
    ],
  },
  {
    slug: "booking-policy",
    title: "Booking Policy",
    description:
      "Draft booking policy for Pattaya table enquiries, written confirmations, payment arrangements, changes and cancellation requests.",
    sections: [
      {
        heading: "From enquiry to confirmation",
        body: "Send your preferred date, package and group size through WhatsApp. The team checks venue availability and discusses the details with you. A reservation is secured only when you receive explicit confirmation of your booking.",
      },
      {
        heading: "What to confirm",
        body: "Check the venue, date, local arrival time, table size, package inclusions, final total and any cover or other fees. For VIP Gold, specifically ask how many guests the venue can seat and how any cover applies. Keep the final arrangements in writing.",
      },
      {
        heading: "Payments and deposits",
        body: "Ask whether payment or a deposit is required for your requested table. Before paying, obtain the amount, recipient, payment method, due date and refund terms in your booking conversation. The website enquiry form does not take payments.",
      },
      {
        heading: "Changes and cancellations",
        body: "Contact the team in your original chat as soon as your plans change. Include the date, venue and amendment you are requesting. A revised date, group size or package requires a new availability check and explicit agreement.",
      },
      {
        heading: "Refunds",
        body: "Ask for the cancellation, no-show and refund terms that apply to your reservation before payment. If you need a refund, contact the team with your booking details and the terms you received so your request can be reviewed.",
      },
      {
        heading: "Pending review and contact",
        body: `${contact} Payment arrangements, deposit requirements, cancellation deadlines, change fees and refund procedures still require owner and local legal review.`,
      },
    ],
  },
];
