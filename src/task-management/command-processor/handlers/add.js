const { PrismaClient } = require('@prisma/client');
const _ = require('lodash');
const eventBus = require('../eventBus');
const { TaskEvent, TaskStreamEvent } = require('../../enums');

const prisma = new PrismaClient();

module.exports = async (data) => {
  const workers = await prisma.user.findMany({
    where: {
      role: 'worker',
    },
  });
  const assignee = _.sample(workers);
  const task = await prisma.task.create({
    data: {
      title: data.title,
      assigneePublicId: assignee.publicId,
    },
  });

  await eventBus.emit({
    name: TaskStreamEvent.Created,
    data: { task },
  });

  await eventBus.emit({
    name: TaskEvent.Assigned,
    data: {
      task: {
        publicId: task.publicId,
      },
      user: {
        publicId: assignee.publicId,
      },
    },
  });

  await eventBus.emit({
    name: TaskEvent.Added,
    data: { publicId: task.publicId },
  });
};
