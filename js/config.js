// Business settings. Edit these values — everything else on the site reads from here.
window.AURORA_CONFIG = Object.freeze({
  name: "Aurora Taxi Kiruna",
  phoneDisplay: "+46 73 672 65 63",
  phoneE164: "+46736726563",
  whatsapp: "46736726563", // international format, no "+" or spaces (used by wa.me)
  email: "booking@aurorataxi.se",
  address: "Kyrkogatan 21a, 981 42 Kiruna, Sweden",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aurora+Taxi+Kiruna+Kyrkogatan+21a",
  reviewsUrl: "https://www.google.com/maps/search/?api=1&query=Aurora+Taxi+Kiruna",
  rating: { value: 4.9, count: 32 },

  // Fixed prices in SEK, keyed "fromId>toId" (place ids from js/places.js).
  // Leave empty to show "price confirmed when you book". Never publish a price you won't honour.
  fixedFares: {
    // "krn>kiruna-centre": 450,
  },

  // Live aurora (Kp) data from NOAA SWPC. Set to false to disable the external request.
  auroraWidget: true,
});
