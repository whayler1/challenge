var exports = (module.exports = {});

/**
 * A collection of stats for a category. These can be calculated from an array
 * of projects of the same category.
 *
 * category: String
 *   The category.
 * meanBackers: Integer
 *   The mean number of backers to a project for the category, i.e. (total backers / number of projects)
 * meanPledged: Integer
 *   The mean number pledged to a project for the category, i.e. (total pledged / number of projects)
 * totalBackers: Integer
 *   The total number of backers for all a category's projects.
 * totalPledged: Integer
 *   The total number pledged for all a category's projects.
 * totalProjects: Integer
 *   The total number of projects in this category.
 */

exports.CategoryStats = class Project {
  constructor(
    category,
    meanBackers,
    meanPledged,
    totalBackers,
    totalPledged,
    totalProjects
  ) {
    this.category = category;
    this.meanBackers = meanBackers;
    this.meanPledged = meanPledged;
    this.totalBackers = totalBackers;
    this.totalPledged = totalPledged;
    this.totalProjects = totalProjects;
  }
};
