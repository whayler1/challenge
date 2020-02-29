var exports = (module.exports = {});

/**
 * backers: Number
 *   The total number of backers to the project
 * category: String
 *   The category that this project belongs to.
 * goal: Number
 *   The amount the project had set as its goal.
 * id: Number
 *   The id of the project.
 * name: String
 *   The name of the project.
 * pledged: Number
 *   The total amount the project has raised.
 */

exports.Project = class Project {
  constructor(backers, category, goal, id, name, pledged) {
    this.backers = backers;
    this.category = category;
    this.goal = goal;
    this.id = id;
    this.name = name;
    this.pledged = pledged;
  }
};
