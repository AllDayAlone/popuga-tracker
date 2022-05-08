const { TaskCommand } = require('../enums');
const Consumer = require('../../shared/Consumer');

const handlers = {
  [TaskCommand.Add]: require('./handlers/add'),
  [TaskCommand.Complete]: require('./handlers/complete'),
  [TaskCommand.ShuffleOpen]: require('./handlers/shuffleOpen'),
};

const consumer = new Consumer({
  groupId: 'tracker-processor-2',
  topics: ['task-commands'],
  eachMessage: async (command) => {
    const handler = handlers[command.name];

    if (!handler) {
      console.log(`No handler for ${command.name} command.`);
      return;
    }

    await handler(command.data);
  },
});

consumer.start();
