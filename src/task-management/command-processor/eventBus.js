const Producer = require('../../shared/Producer');
const { TaskEvent, TaskStreamEvent } = require('../enums');

const topics = [
  { name: 'task-events', events: Object.values(TaskEvent) },
  { name: 'task-stream', events: Object.values(TaskStreamEvent) },
];

module.exports = new Producer({ topics });
