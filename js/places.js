// Pick-up / drop-off locations in Kiruna and Swedish Lapland.
// Coordinates are approximate and only used for rough distance/time estimates.
// cat: transport | hotel | sight | nature | town
window.AURORA_PLACES = Object.freeze([
  // Transport hubs
  { id: "krn", name: "Kiruna Airport (KRN)", cat: "transport", area: "Kiruna", lat: 67.822, lon: 20.337 },
  { id: "kiruna-c", name: "Kiruna C – train station", cat: "transport", area: "Kiruna", lat: 67.856, lon: 20.236 },
  { id: "kiruna-centre", name: "Kiruna city centre (Stadshuset)", cat: "town", area: "Kiruna", lat: 67.852, lon: 20.290 },
  { id: "kiruna-hospital", name: "Kiruna Hospital", cat: "transport", area: "Kiruna", lat: 67.858, lon: 20.214 },

  // Hotels & stays
  { id: "icehotel", name: "ICEHOTEL", cat: "hotel", area: "Jukkasjärvi", lat: 67.851, lon: 20.594 },
  { id: "camp-ripan", name: "Camp Ripan", cat: "hotel", area: "Kiruna", lat: 67.862, lon: 20.233 },
  { id: "scandic-ferrum", name: "Scandic Ferrum", cat: "hotel", area: "Kiruna", lat: 67.857, lon: 20.227 },
  { id: "nutti", name: "Nutti Sámi Siida", cat: "hotel", area: "Jukkasjärvi", lat: 67.850, lon: 20.591 },
  { id: "stf-abisko", name: "STF Abisko Turiststation", cat: "hotel", area: "Abisko", lat: 68.358, lon: 18.784 },
  { id: "abisko-mountain-lodge", name: "Abisko Mountain Lodge", cat: "hotel", area: "Abisko", lat: 68.349, lon: 18.830 },
  { id: "bjorkliden", name: "Hotell Fjället Björkliden", cat: "hotel", area: "Björkliden", lat: 68.408, lon: 18.687 },
  { id: "riksgransen", name: "Riksgränsen ski resort & hotel", cat: "hotel", area: "Riksgränsen", lat: 68.426, lon: 18.126 },

  // Sights & experiences
  { id: "aurora-sky-station", name: "Aurora Sky Station (Nuolja)", cat: "sight", area: "Abisko", lat: 68.358, lon: 18.784 },
  { id: "jukkasjarvi-church", name: "Jukkasjärvi Church", cat: "sight", area: "Jukkasjärvi", lat: 67.851, lon: 20.601 },
  { id: "kiruna-church", name: "Kiruna Church", cat: "sight", area: "Kiruna", lat: 67.850, lon: 20.298 },
  { id: "lkab-visitor", name: "LKAB Visitor Centre / mine tours", cat: "sight", area: "Kiruna", lat: 67.846, lon: 20.214 },
  { id: "esrange", name: "Esrange Space Center", cat: "sight", area: "Kiruna", lat: 67.893, lon: 21.107 },
  { id: "luossabacken", name: "Luossabacken ski slope", cat: "nature", area: "Kiruna", lat: 67.871, lon: 20.212 },

  // Nature & trailheads
  { id: "abisko-np", name: "Abisko National Park", cat: "nature", area: "Abisko", lat: 68.357, lon: 18.790 },
  { id: "nikkaluokta", name: "Nikkaluokta (Kebnekaise trailhead)", cat: "nature", area: "Nikkaluokta", lat: 67.851, lon: 19.016 },
  { id: "kurravaara", name: "Kurravaara", cat: "nature", area: "Kiruna", lat: 67.906, lon: 20.333 },
  { id: "tornetrask", name: "Lake Torneträsk", cat: "nature", area: "Abisko", lat: 68.330, lon: 19.300 },

  // Towns & long distance
  { id: "jukkasjarvi", name: "Jukkasjärvi village", cat: "town", area: "Jukkasjärvi", lat: 67.851, lon: 20.597 },
  { id: "svappavaara", name: "Svappavaara", cat: "town", area: "Kiruna kommun", lat: 67.647, lon: 21.064 },
  { id: "vittangi", name: "Vittangi", cat: "town", area: "Kiruna kommun", lat: 67.682, lon: 21.638 },
  { id: "gallivare", name: "Gällivare", cat: "town", area: "Norrbotten", lat: 67.133, lon: 20.660 },
  { id: "narvik", name: "Narvik (Norway)", cat: "town", area: "Norway", lat: 68.438, lon: 17.427 },
  { id: "lulea", name: "Luleå", cat: "town", area: "Norrbotten", lat: 65.584, lon: 22.154 },
]);

window.AURORA_ROUTES = Object.freeze([
  ["krn", "kiruna-centre"],
  ["krn", "icehotel"],
  ["kiruna-c", "camp-ripan"],
  ["kiruna-centre", "stf-abisko"],
  ["kiruna-centre", "nikkaluokta"],
  ["kiruna-centre", "riksgransen"],
  ["kiruna-centre", "esrange"],
  ["kiruna-centre", "gallivare"],
  ["kiruna-centre", "narvik"],
]);
