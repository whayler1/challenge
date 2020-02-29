const challenge = require("lib/challenge");
const fixtures = require("test/fixtures");
const CategoryStats = require("lib/challenge/models/category_stats")
  .CategoryStats;
const Pledge = require("lib/challenge/models/pledge").Pledge;
const PledgeChange = require("lib/challenge/models/pledge_change").PledgeChange;

test("001 hello world", () => {
  expect(challenge.hello()).toBe("world");
});

test("002 double and only return those greater than ten", () => {
  expect(challenge.doubleAndGreaterThanTen([16, 2, 4, 8, 1])).toEqual([16, 32]);
});

test("003 select ids of art category projects", () => {
  expect(
    challenge.selectIdsOfArtCategoryProjects([fixtures.miniMuseum])
  ).toEqual([845]);

  const projects = [
    fixtures.miniMuseum,
    fixtures.kungFury,
    fixtures.meowWolf,
    fixtures.doubleFineAdventure
  ];

  expect(challenge.selectIdsOfArtCategoryProjects(projects)).toEqual([
    199,
    845
  ]);
});

test("004 total amount pledged", () => {
  const pledges = [
    new Pledge(25, 180, 5, 2, 901),
    new Pledge(25, 180, 5, 2, 7),
    new Pledge(95, 181, 20, 15, 335),
    new Pledge(5, 182, 0, 0, 866),
    new Pledge(25, 180, 5, 2, 717)
  ];

  expect(challenge.totalAmountPledged(pledges)).toEqual(231);
});

test("005 category stats sorted by category name", () => {
  const projects = [
    fixtures.beeAndPuppyCat,
    fixtures.doubleFineAdventure,
    fixtures.kungFury,
    fixtures.meowWolf,
    fixtures.miniMuseum,
    fixtures.theBurningWheelCodex
  ];

  expect(challenge.categoryStatsSortedByCategoryName(projects)).toEqual([
    new CategoryStats("art", 2955, 666016, 5910, 1332032, 2),
    new CategoryStats("film", 17961, 751076, 35922, 1502152, 2),
    new CategoryStats("games", 44625, 1722366, 89251, 3444733, 2)
  ]);
});

test("006 had project reached goal after each pledge change", () => {
  const pledgeChanges = [
    new PledgeChange("adjust", -50),
    new PledgeChange("cancel", -25),
    new PledgeChange("new", 25),
    new PledgeChange("new", 10),
    new PledgeChange("cancel", -25),
    new PledgeChange("new", 25),
    new PledgeChange("new", 25),
    new PledgeChange("cancel", -25),
    new PledgeChange("new", 25),
    new PledgeChange("adjust", 15)
  ];
  expect(
    challenge.hadProjectReachedGoalAfterEachPledgeChange(
      fixtures.skullGraphicTee,
      pledgeChanges
    )
  ).toEqual([
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    true
  ]);
});

test("007 compare monthly stats per year", () => {
  const monthlyStats2014 = [35, 48, 45, 60, 39, 43, 29, 34, 44, 47, 55, 37];
  const monthlyStats2015 = [63, 58, 41, 39, 59, 58, 69, 58, 37, 66, 32, 51];
  expect(
    challenge.compareMonthlyStatsPerYear(monthlyStats2014, monthlyStats2015)
  ).toEqual([28, 10, -4, -21, 20, 15, 40, 24, -7, 19, -23, 14]);

  expect(challenge.compareMonthlyStatsPerYear([5, 7], [9, 8, 3])).toEqual([
    4,
    1
  ]);

  expect(challenge.compareMonthlyStatsPerYear([5, 7, 9], [8, 3])).toEqual([
    3,
    -4
  ]);
});

test("008 recommend projects from same category", () => {
  expect(
    challenge.recommendProjectsFromSameCategory(fixtures.beeAndPuppyCat, [
      fixtures.obviousChild,
      fixtures.kungFury
    ])
  ).toEqual([fixtures.kungFury, fixtures.obviousChild]);

  expect(
    challenge.recommendProjectsFromSameCategory(fixtures.beeAndPuppyCat, [
      fixtures.kungFury,
      fixtures.beeAndPuppyCat
    ])
  ).toEqual([fixtures.kungFury]);

  expect(
    challenge.recommendProjectsFromSameCategory(fixtures.beeAndPuppyCat, [
      fixtures.kungFury,
      fixtures.meowWolf
    ])
  ).toEqual([fixtures.kungFury]);
});

test("009 recommendation feed", () => {
  // should return other film projects
  expect(
    challenge.recommendationFeed(
      [fixtures.beeAndPuppyCat],
      fixtures.allProjects
    )
  ).toEqual([fixtures.kungFury, fixtures.obviousChild]);

  // should return other film and art projects
  expect(
    challenge.recommendationFeed(
      [fixtures.meowWolf, fixtures.beeAndPuppyCat],
      fixtures.allProjects
    )
  ).toEqual([fixtures.kungFury, fixtures.miniMuseum, fixtures.obviousChild]);

  // should not contain duplicates or projects the user has already backed
  expect(
    challenge.recommendationFeed(
      [fixtures.kungFury, fixtures.obviousChild],
      fixtures.allProjects
    )
  ).toEqual([fixtures.beeAndPuppyCat]);

  expect(challenge.recommendationFeed([], [])).toEqual([]);
});

test("010 flip", () => {
  const exponent = (x, y) => {
    return Math.pow(x, y);
  };
  expect(exponent(5, 2)).toEqual(25);
  expect(exponent(5, 3)).toEqual(125);

  // same result as exponent(2, 5)
  expect(challenge.flip(exponent)(5, 2)).toEqual(32);

  // same result as exponent(3, 5)
  expect(challenge.flip(exponent)(5, 3)).toEqual(243);
});

test("011 activity feed", () => {
  const activities = [
    "like",
    "comment",
    "comment",
    "pledge",
    "pledge",
    "pledge",
    "pledge",
    "like",
    "pledge",
    "like",
    "like"
  ];

  expect(challenge.activityFeed(activities)).toEqual([
    ["like", 1],
    ["comment", 2],
    ["pledge", 4],
    ["like", 1],
    ["pledge", 1],
    ["like", 2]
  ]);
});
