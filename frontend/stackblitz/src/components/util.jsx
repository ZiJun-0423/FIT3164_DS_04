const logoMap = {
  "adelaide-crows": "adelaideCrows.png",
  "brisbane-lions": "brisbaneLions.png",
  "carlton-blues": "carlton.png",
  "collingwood-magpies": "collingwood.png",
  "essendon-bombers": "essendon.png",
  "fremantle-dockers": "fremantle.png",
  "geelong-cats": "geelongCats.png",
  "gold-coast-suns": "goldCoastSuns.png",
  "gws-giants": "greatWesternSydneyGiants.png",
  "hawthorn-hawks": "hawthornHawks.png",
  "melbourne-demons": "melbourne.png",
  "north-melbourne-kangaroos": "northMelbourne.png",
  "port-adelaide-power": "portAdelaide.png",
  "richmond-tigers": "richmondTigers.png",
  "st-kilda-saints": "stKilda.png",
  "sydney-swans": "sydneySwan.png",
  "west-coast-eagles": "westCoastEagles.png",
  "western-bulldogs": "westernBulldogs.jpg"
};

export default function makeLogo(name) {
  if (!name) return "/logos/default.png";

  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const filename = logoMap[slug];

  return filename ? `/logos/${filename}` : `/logos/default.png`;
}
  