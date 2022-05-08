const Producer = require('../../shared/Producer');
const { TaskEvent, TaskStreamEvent } = require('../enums');

const topics = [
  { name: 'task-events', messageNames: Object.values(TaskEvent) },
  { name: 'task-stream', messageNames: Object.values(TaskStreamEvent) },
];

module.exports = new Producer({ topics });
