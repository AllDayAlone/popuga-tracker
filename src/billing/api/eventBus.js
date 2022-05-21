const Producer = require('../../shared/Producer');
const { BillingEvent } = require('../../shared/enums');

const topics = [
  { name: 'billing-events', messageNames: Object.values(BillingEvent) },
];

module.exports = new Producer({ topics });
