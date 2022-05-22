const { PrismaClient } = require('@prisma/client');
const _ = require('lodash');
const Consumer = require('../../../shared/Consumer');
const { TaskStreamEvent } = require('../../../shared/enums');

const prisma = new PrismaClient();

const handlers = {
  [TaskStreamEvent.Created]: async ({ taskPublicId, title }) => {
    await prisma.task.create({
      data: {
        taskPublicId,
        title,
        assignCost: _.random(10, 21) * 100,
        bountyCost: _.random(20, 41) * 100,
      },
    });
  },
};

const consumer = new Consumer({
  groupId: 'billing-task-stream-consumer',
  topics: ['task-stream'],
  eachMessage: async (command) => {
    const handler = handlers[command.eventName];

    if (!handler) {
      console.log(`No handler for ${command.eventName} command.`);
      return;
    }

    await handler(command.data);
  },
});

module.exports = consumer;
