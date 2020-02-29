var exports = (module.exports = {});

const project = require("lib/challenge/models/project");

const Project = project.Project;

const miniMuseum = new Project(5030, "art", 38000, 845, "Mini Museum", 1226811);
exports.miniMuseum = miniMuseum;

const beeAndPuppyCat = new Project(
  18209,
  "film",
  600000,
  550,
  "Bee and PuppyCat: The Series",
  872133
);
exports.beeAndPuppyCat = beeAndPuppyCat;

const doubleFineAdventure = new Project(
  87142,
  "games",
  400000,
  910,
  "Double Fine Adventure",
  3336371
);
exports.doubleFineAdventure = doubleFineAdventure;

const kungFury = new Project(17713, "film", 200000, 668, "Kung Fury", 630019);
exports.kungFury = kungFury;

const meowWolf = new Project(
  880,
  "art",
  100000,
  199,
  "Meow Wolf Art Complex ft. The House of Eternal Return",
  105221
);
exports.meowWolf = meowWolf;

const obviousChild = new Project(
  631,
  "film",
  35000,
  49,
  "OBVIOUS CHILD",
  37214
);
exports.obviousChild = obviousChild;

const ofMontreal = new Project(
  1124,
  "music",
  75000,
  613,
  'of Montreal "Song Dynasties" Feature-Length Documentary',
  94844
);
exports.ofMontreal = ofMontreal;

const skullGraphicTee = new Project(
  5,
  "fashion",
  100,
  999,
  "SKULL GRAPHIC TEE",
  125
);
exports.skullGraphicTee = skullGraphicTee;

const theBurningWheelCodex = new Project(
  2109,
  "games",
  25000,
  381,
  "The Burning Wheel Codex",
  108362
);
exports.theBurningWheelCodex = theBurningWheelCodex;

exports.allProjects = [
  beeAndPuppyCat,
  doubleFineAdventure,
  kungFury,
  meowWolf,
  miniMuseum,
  obviousChild,
  ofMontreal,
  skullGraphicTee,
  theBurningWheelCodex
];
