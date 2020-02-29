/*
 * Backers may make new pledges, adjust the amount of an existing pledge, or cancel
 * their pledge.
 *
 * If a backer made a new pledge of 25, increased the amount by 10, then
 * cancelled their pledge, that would be represented by the following values:
 *
 * new PledgeChange('new', 25)
 * new PledgeChange('adjust', 10)
 * new PledgeChange('cancel', -35)
 *
 * action: String
 *   The type of change being made to the pledge. Can either be new, adjust, or
 *   cancel.
 * delta: Integer
 *   The difference in pledge value when the change is applied.
 */
exports.PledgeChange = class PledgeChange {
  constructor(action, delta) {
    this.action = action;
    this.delta = delta;
  }
};
