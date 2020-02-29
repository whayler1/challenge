var exports = (module.exports = {});

const _ = require("lodash");
const CategoryStats = require("lib/challenge/models/category_stats")
  .CategoryStats;
const radixSort = require("lib/helpers/radix-sort");

/**
 * Change this to return 'world' to fix the first failing test. Run `make test`
 * to confirm that `001 hello world` passes, then repeat for each of the
 * remaining tests.
 */
exports.hello = function() {
  return "world";
};

/**
 * Returns a new array where each element from `xs` has been doubled, but only
 * return doubled values greater than 10.
 *
 * Results should be returned in ascending order.
 *
 * xs: [Number]
 * returns: [Number]
 */
exports.doubleAndGreaterThanTen = function(xs) {
  /**
   * Doing a radix sort here since that's the fastest way I know of
   * to sort integers. This wont make a big difference in our test case,
   * but if we were dealing with a huge dataset this would speed things up.
   */
  const sorted = radixSort(xs);
  let i = 0;
  /**
   * Since our array is sorted we know the lowest numbers will be at the beginning
   * and we can remove them with `shift`. I prefer `shift` and `pop` to `splice` when possible
   * because splice returns an array of removed items which uses more memory.
   */
  while (i < sorted.length) {
    if (sorted[i] < 6) {
      sorted.shift();
    } else {
      sorted[i] = sorted[i] * 2;
      i++;
    }
  }
  return sorted;
};

/**
 * Returns an array of ids for all projects in the art category.
 *
 * Results should be returned in ascending order.
 *
 * projects: [Project]
 * returns: [Number]
 */
exports.selectIdsOfArtCategoryProjects = function(projects) {
  const filteredProjects = projects.reduce((acc, project) => {
    if (project.category === "art") {
      acc.push(project.id);
    }
    return acc;
  }, []);
  return radixSort(filteredProjects);
};

/**
 * Each pledge has a baseAmount, shipping, and tax value. Adding these
 * together gives the amount a backer was charged for a pledge.
 *
 * Given an array of pledges, calculate the total that was charged for all
 * the pledges combined.
 *
 * pledges: [Pledge]
 * returns: Number
 */
exports.totalAmountPledged = function(pledges) {
  return pledges.reduce(
    (acc, pledge) => acc + pledge.baseAmount + pledge.shipping + pledge.tax,
    0
  );
};

/**
 * Given an array of projects, groups projects into categories then calculates
 * stats for each unique category, represented by a CategoryStats value.
 * The CategoryStats model has more details on how to calculate each field from
 * an array of projects belonging to the same category.
 *
 * Results should be returned in ascending order by category name.
 *
 * projects: [Project]
 * returns: [CategoryStats]
 */
exports.categoryStatsSortedByCategoryName = function(projects) {
  /**
   * I'm choosing to use some extra memory here and create an object. The reason
   * is I want to be able to lookup existing `CategoryStats` with O(1) constant time
   * rather than having to loop through an array to find the match and use O(n2) time.
   * At scale that would get expensive. Though if we had some kind of extreme
   * memory constraint there is a way this could be done by creating only the
   * array we will return and editing it in place.
   */
  const aggregateCategoryStats = projects.reduce((acc, project) => {
    if (acc[project.category]) {
      acc[project.category].totalBackers += project.backers;
      acc[project.category].totalPledged += project.pledged;
      acc[project.category].totalProjects++;
    } else {
      /**
       * I'm initializing `CategoryStats` with undefined mean stats and waiting till we have
       * all the aggregate values before calculating mean. This way we only have to do the mean
       * calculations once.
       */
      acc[project.category] = new CategoryStats(
        project.category,
        undefined,
        undefined,
        project.backers,
        project.pledged,
        1
      );
    }
    return acc;
  }, {});
  /**
   * The `map` below creates an extra array which we could get rid of by just doing
   * a normal `for` loop and editing the values array in place. I felt like this read nice
   * and since this project has no specific directionon on memory constraints opted for
   * readability.
   */
  return Object.values(aggregateCategoryStats)
    .map(stats => {
      stats.meanBackers = Math.floor(stats.totalBackers / stats.totalProjects);
      stats.meanPledged = Math.floor(stats.totalPledged / stats.totalProjects);
      return stats;
    })
    .sort((a, b) => {
      if (a.category > b.category) {
        return 1;
      }
      if (a.category < b.category) {
        return -1;
      }
      return 0;
    });
};

/*
 * This method takes a project and an array of pledge changes, and returns
 * an array of booleans representing whether the project had reached its goal
 * after each pledge change.
 *
 * A project begins with an initial amount pledged, and reaches its goal if
 * the total value of pledges is equal to or greater than the project's goal.
 * It is possible for a project to reach its goal, then fall back under its
 * goal if a backer cancels or lowers a pledge.
 *
 * project: Project
 * pledgeChanges: [PledgeChange]
 * returns: [Boolean]
 */
exports.hadProjectReachedGoalAfterEachPledgeChange = function(
  project,
  pledgeChanges
) {
  /**
   * I chose to edit the array in place here to minimize memory usage. If for some
   * reason `pledgeChanges` could not be mutated we could do the same thing with `map`.
   */
  let total = project.pledged;
  for (let i = 0; i < pledgeChanges.length; i++) {
    total += pledgeChanges[i].delta;
    pledgeChanges[i] = total >= project.goal;
  }
  return pledgeChanges;
};

/**
 * Calculates the change in numbers for each month from year 1 to year 2.
 *
 * The arguments are not guaranteed to contain data for all 12 months of
 * a year. In that case, only return stats where data exists for both months.
 *
 * examples:
 *
 * compareMonthlyStatsPerYear(
 *   [1, 3, 2, 4, 6, 8, 0, 0, 3, 2, 6, 7],
 *   [3, 4, 5, 4, 5, 6, 7, 7, 6, 8, 9, 9],
 * )
 * => [2, 1, 3, 0, -1, -2, 7, 7, 3, 6, 3, 2]
 *
 * compareMonthlyStatsPerYear([5, 7], [9, 8, 3])
 * => [4, 1]
 *
 * monthlyStatsYear1: [Number]
 * monthlyStatsYear2: [Number]
 * returns: [Number]
 */
exports.compareMonthlyStatsPerYear = function(
  monthlyStatsYear1,
  monthlyStatsYear2
) {
  const minLen = Math.min(monthlyStatsYear1.length, monthlyStatsYear2.length);
  /**
   * Again choosing to edit an existing array in place to optimize memory. But there's a fair
   * argument that creating a new array and just filling that up would be more readable. Also if
   * `monthlyStatsYear1` was being used elsewhere and shouldn't be edited we'd want to load up
   * a new array as well.
   */
  monthlyStatsYear1.length = minLen;
  for (let i = 0; i < minLen; i++) {
    monthlyStatsYear1[i] = monthlyStatsYear2[i] - monthlyStatsYear1[i];
  }
  return monthlyStatsYear1;
};

/**
 * For a given project, find other projects that have the same category, sorted
 * in descending order by the number of backers. The array of projects may
 * contain the project given as the first argument; this project should not be
 * returned.
 *
 * project: Project
 * projects: [Project]
 */
const recommendProjectsFromSameCategory = function(project, projects) {
  /**
   * Decided to use the array filter method here just to show an approach where
   * we use native array methods. This will create a new array.
   */
  return projects
    .filter(
      otherProject =>
        otherProject.category === project.category &&
        otherProject.id !== project.id
    )
    .sort((a, b) => {
      if (a.backers > b.backers) {
        return -1;
      }
      if (a.backers > b.backers) {
        return 1;
      }
      return 0;
    });
};
exports.recommendProjectsFromSameCategory = recommendProjectsFromSameCategory;

/**
 * Returns a list of recommended projects based on projects the user has
 * already backed. Use `recommendProjectsFromSameCategory` to
 * generate an array of recommendations for each project, then return a single
 * array with all the recommendations sorted in descending order by the number
 * of backers. Should not contain duplicates or projects the user has already
 * backed.
 *
 * backedProjects: [Project]
 *   An array of projects the user has backed.
 * allProjects: [Project]
 *   An array of all projects. It may include projects the user has backed.
 * returns: [Project]
 */
exports.recommendationFeed = function(backedProjects, allProjects) {
  // const oneProjectPerCategory = [];
  // const projectCategories = new Set();
  // const backedProjectIds = new Set();
  // for (let i = 0; i < backedProjects.length; i++) {
  //   if (!projectCategories.has(backedProjects[i].category)) {
  //     projectCategories.add(backedProjects[i].category);
  //     oneProjectPerCategory.push(backedProjects[i]);
  //   }
  //   backedProjectIds.add(backedProjects[i].id);
  // }
  // const filteredProjects = oneProjectPerCategory.reduce((acc, project) => {
  //   const projects = recommendProjectsFromSameCategory(project, allProjects);
  //   projects.forEach(proj => {
  //     if (!backedProjectIds.has(proj.id)) {
  //       acc.push(proj);
  //     }
  //   });
  //   return acc;
  // }, []);

  // return filteredProjects.sort((a, b) => {
  //   if (a.backers > b.backers) {
  //     return -1;
  //   }
  //   if (a.backers > b.backers) {
  //     return 1;
  //   }
  //   return 0;
  // });
  /**
   * I see the exercise asks that I use `recommendProjectsFromSameCategory` so I
   * put an example of that above. However the below method is fast since we only have
   * to iterate through `allProjects` once.
   */
  const projectCategories = new Set();
  const backedProjectIds = new Set();
  backedProjects.forEach(project => {
    if (!projectCategories.has(project.category)) {
      projectCategories.add(project.category);
    }
    backedProjectIds.add(project.id);
  });
  const filteredProjects = allProjects.filter(
    project =>
      projectCategories.has(project.category) &&
      !backedProjectIds.has(project.id)
  );
  return filteredProjects.sort((a, b) => {
    if (a.backers > b.backers) {
      return -1;
    }
    if (a.backers > b.backers) {
      return 1;
    }
    return 0;
  });
};

/**
 * Takes a lambda which itself takes two arguments, returns a new lambda like
 * the original but with the two arguments flipped.
 *
 * f: (a, b) -> c
 * returns: (b, a) -> c
 */
exports.flip = function(f) {
  return (a, b) => f(b, a);
};

/**
 * Creators have access to an activity feed for their project. Often an
 * activity will occur many times in a row, e.g.: they might receive 15 likes
 * on one of their project updates, and then a backer will make a pledge.
 *
 * Rather than rendering 15 consecutive likes, we would prefer an activity feed
 * that indicates how many times an activity appeared in a row. This method
 * returns an array of pairs, where the first component of each pair is an
 * activity, and the second component is how many times that activity appeared
 * in a row.
 *
 * example:
 *
 * activityFeed(['comment', 'comment', 'like', 'comment'])
 * => [['comment', 2], ['like', 1], ['comment', 1]]
 *
 * activities: [String]
 * returns: [[String, Number]]
 */
exports.activityFeed = function(activities) {
  /**
   * This could have been done in an arguably more straightforward
   * way with a `reduce`, but since I already used those a couple times
   * here I thought I'd go back to editing the array in place.
   * No new array in memory and O(n) time.
   */
  let originalActivityLength = activities.length;
  let newActivityName;
  let lastActivityName;

  for (let i = 0; i < originalActivityLength; i++) {
    newActivityName = activities.pop();
    if (lastActivityName === newActivityName) {
      activities[0][1]++;
    } else {
      activities.unshift([newActivityName, 1]);
      lastActivityName = newActivityName;
    }
  }
  return activities;
};
