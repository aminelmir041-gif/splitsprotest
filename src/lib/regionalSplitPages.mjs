const REGIONAL_PAGES = {
  "oran-park": {
    name: "Oran Park & South-West Growth Area",
    shortName: "Oran Park & South-West Sydney",
    canonical: "https://splitspro.com.au/split-systems/oran-park/",
    areas: "Oran Park, Edmondson Park, Leppington, Austral, Catherine Field, Gregory Hills, Gledswood Hills, Denham Court, Bardia, Prestons, Middleton Grange, Harrington Park, Narellan, Spring Farm, Cobbitty and surrounding South-West Growth Area suburbs",
  },
  "willoughby-north-sydney": {
    name: "Willoughby & North Sydney",
    shortName: "Willoughby & North Sydney",
    canonical: "https://splitspro.com.au/split-systems/willoughby-north-sydney/",
    areas: "Willoughby, Chatswood, Artarmon, Lane Cove, North Sydney, Crows Nest, Neutral Bay and surrounding Lower North Shore suburbs",
  },
  "central-coast-newcastle": {
    name: "Central Coast & Newcastle",
    shortName: "Central Coast & Newcastle",
    canonical: "https://splitspro.com.au/split-systems/central-coast-newcastle/",
    areas: "Gosford, Erina, Terrigal, Wyong, Tuggerah, Morisset, Lake Macquarie, Newcastle and surrounding suburbs",
  },
  wollongong: {
    name: "Wollongong & Illawarra",
    shortName: "Wollongong",
    canonical: "https://splitspro.com.au/split-systems/wollongong/",
    areas: "Wollongong, Corrimal, Figtree, Dapto, Shellharbour, Albion Park, Kiama and surrounding Illawarra suburbs",
  },
  "quakers-hill-austral-richmond": {
    name: "Quakers Hill, Austral & Richmond",
    shortName: "Quakers Hill, Austral & Richmond",
    canonical: "https://splitspro.com.au/split-systems/quakers-hill-austral-richmond/",
    areas: "Quakers Hill, Schofields, Marsden Park, Riverstone, Richmond, Windsor, Austral, Leppington and surrounding suburbs",
  },
};

export const regionalSplitPages = Object.fromEntries(
  Object.entries(REGIONAL_PAGES).map(([slug, regional]) => [slug, {
    canonical: regional.canonical,
    metaTitle: `Split System Air Conditioning ${regional.shortName} | Supply & Install | SplitsPro`,
    metaDescription: `Split system air conditioning supply and installation across ${regional.areas}. Compare Daikin, Rinnai, Mitsubishi, Fujitsu and Samsung supplied & installed prices.`,
    ogDescription: `Split system supply and installation across ${regional.areas}. Compare trusted brands and book with SplitsPro.`,
    heroTitle: `Split System Air Conditioning ${regional.name}`,
    heroSub: `Compare trusted air conditioning brands, view supplied and installed prices and book professional split system installation across ${regional.areas}.`,
    introHeading: `Split system installation across ${regional.name}`,
    introBody: `SplitsPro supplies and installs split systems across ${regional.areas}. We take the time to size the unit correctly, plan neat indoor and outdoor placement and finish the pipework carefully so the installation looks clean and performs properly.`,
    regionLabel: regional.name,
  }]),
);
