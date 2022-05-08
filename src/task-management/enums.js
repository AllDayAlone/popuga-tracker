const TaskCommand = {
  Add: 'task.add',
  Complete: 'task.complete',
  ShuffleOpen: 'task.shuffleOpen',
};

const TaskEvent = {
  Added: 'task.added',
  Completed: 'task.completed',
  ShuffledOpen: 'task.shuffledOpen',
  Assigned: 'task.assigned',
};

const TaskStreamEvent = {
  Created: 'task.created',
  Updated: 'task.updated',
  Deleted: 'task.deleted',
};

module.exports = { TaskCommand, TaskEvent, TaskStreamEvent };
