export const business = {
  name: "Tuesday Lounge Bar",
  shortName: "Tuesday",
  city: "Aktau, Kazakhstan",
  address: {
    ru: "11-й микрорайон, здание 56",
    kk: "11-шағынаудан, 56-ғимарат",
  },
  hours: "12:00—02:00",
  phone: {
    display: "+7 705 783 31 30",
    international: "+77057833130",
    tel: "tel:+77057833130",
  },
  whatsapp: {
    number: "77057833130",
    url: "https://wa.me/77057833130",
  },
  instagram: "https://www.instagram.com/tuesday.lb",
  map: "https://www.google.com/maps/search/?api=1&query=11th%20microdistrict%2056%20Aktau%20Kazakhstan",
  promotion: {
    price: 4500,
    hours: "12:00—19:00",
  },
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

