const { PrismaClient } = require('@prisma/client');
const Consumer = require('../../shared/Consumer');

const prisma = new PrismaClient();

const handlers = {
  'user.created': async ({ user }) => {
    await prisma.user.create({
      data: {
        publicId: user.id,
        name: user.name,
        role: user.role,
      },
    });
  },
};

const consumer = new Consumer({
  groupId: 'task-management-consumer',
  topics: ['user-stream'],
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