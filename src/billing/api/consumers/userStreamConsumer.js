const { PrismaClient } = require('@prisma/client');
const Consumer = require('../../../shared/Consumer');
const { UserStreamEvent } = require('../../../shared/enums');

const prisma = new PrismaClient();

const handlers = {
  [UserStreamEvent.Created]: async ({ user }) => {
    await prisma.account.create({
      data: {
        userPublicId: user.id,
      },
    });
  },
};

const consumer = new Consumer({
  groupId: 'billing-user-stream-consumer',
  topics: ['user-stream'],
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
