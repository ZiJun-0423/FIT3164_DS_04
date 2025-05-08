const nameToSlug = {
  "adelaide": "adelaide-crows",
  "brisbane": "brisbane-lions",
  "carlton": "carlton-blues",
  "collingwood": "collingwood-magpies",
  "essendon": "essendon-bombers",
  "fremantle": "fremantle-dockers",
  "geelong": "geelong-cats",
  "gold coast": "gold-coast-suns",
  "gws": "gws-giants",
  "hawthorn": "hawthorn-hawks",
  "melbourne": "melbourne-demons",
  "north melbourne": "north-melbourne-kangaroos",
  "port adelaide": "port-adelaide-power",
  "richmond": "richmond-tigers",
  "st kilda": "st-kilda-saints",
  "sydney": "sydney-swans",
  "west coast": "west-coast-eagles",
  "western bulldogs": "western-bulldogs"
};

const logoMap = {
  "adelaide-crows": "..../teamLogo/adelaideCrows.png",
  "brisbane-lions": "..../teamLogo/brisbaneLions.png",
  "carlton-blues": "..../teamLogo/carlton.png",
  "collingwood-magpies": "..../teamLogo/collingwood.png",
  "essendon-bombers": "..../teamLogo/essendon.png",
  "fremantle-dockers": "..../teamLogo/fremantle.png",
  "geelong-cats": "..../teamLogo/geelongCats.png",
  "gold-coast-suns": "..../teamLogo/goldCoastSuns.png",
  "gws-giants": "..../teamLogo/greatWesternSydneyGiants.png",
  "hawthorn-hawks": "..../teamLogo/hawthornHawks.png",
  "melbourne-demons": "..../teamLogo/melbourne.png",
  "north-melbourne-kangaroos": "..../teamLogo/northMelbourne.png",
  "port-adelaide-power": "..../teamLogo/portAdelaide.png",
  "richmond-tigers": "..../teamLogo/richmondTigers.png",
  "st-kilda-saints": "..../teamLogo/stKilda.png",
  "sydney-swans": "..../teamLogo/sydneySwan.png",
  "west-coast-eagles": "..../teamLogo/westCoastEagles.png",
  "western-bulldogs": "..../teamLogo/westernBulldogs.jpg"
};

export default function makeLogo(name) {
  if (!name) return "/logos/default.png";

  const cleaned = name.trim().toLowerCase();
  const slug = nameToSlug[cleaned];

  const filename = slug ? logoMap[slug] : null;

  return filename || "/logos/default.png";
}

  