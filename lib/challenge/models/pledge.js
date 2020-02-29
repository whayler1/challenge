var exports = module.exports = {}

/**
 * baseAmount: Number
 *   The cost in dollars for the reward, excluding shipping and tax.
 * rewardId: Number
 *   The id of the reward.
 * shipping: Number
 *   The cost in dollars for shipping.
 * tax: Number
 *   The cost in dollars for tax.
 * userId: Number
 *   The id of the user that pledged for the reward.
 */

exports.Pledge = class Pledge {
  constructor(baseAmount, rewardId, shipping, tax, userId) {
    this.baseAmount = baseAmount
    this.rewardId = rewardId
    this.shipping = shipping
    this.tax = tax
    this.userId = userId
  }
}
