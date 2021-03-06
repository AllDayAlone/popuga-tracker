const { PrismaClient } = require('@prisma/client');
const _ = require('lodash');
const eventBus = require('../eventBus');
const { TaskEvent, TaskStreamEvent } = require('../../../shared/enums');

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
    data: {
      taskPublicId: task.publicId,
      title: task.title,
    },
  });

  await eventBus.emit({
    name: TaskEvent.Assigned,
    data: {
      taskPublicId: task.publicId,
      assigneePublicId: assignee.publicId,
    },
  });

  await eventBus.emit({
    name: TaskEvent.Added,
    data: { publicId: task.publicId },
  });
};
