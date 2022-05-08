const { PrismaClient } = require('@prisma/client');
const _ = require('lodash');
const eventBus = require('../eventBus');

const prisma = new PrismaClient();

const { TaskEvent, TaskStreamEvent } = require('../../enums');

const mapPick = (collection, fields) => _.map(collection, (item) => _.pick(item, fields));

module.exports = async () => {
  const workers = await prisma.user.findMany({
    where: {
      role: 'worker',
    },
  });
  const openTasks = await prisma.task.findMany({
    where: {
      isCompleted: false,
    },
  });

  const updatedTasks = await Promise.all(openTasks.map(async (task) => {
    const assignee = _.sample(workers);
    const updatedTask = await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        assigneePublicId: assignee.publicId,
      },
    });

    await eventBus.emit({
      name: TaskStreamEvent.Updated,
      data: { task: updatedTask },
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

    return updatedTask;
  }));

  await eventBus.emit({
    name: TaskEvent.ShuffledOpen,
    data: {
      tasks: mapPick(updatedTasks, ['publicId', 'assigneePublicId']),
    },
  });
};
