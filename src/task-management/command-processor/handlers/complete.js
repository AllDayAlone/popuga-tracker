const { PrismaClient } = require('@prisma/client');
const eventBus = require('../eventBus');

const prisma = new PrismaClient();

const { TaskEvent, TaskStreamEvent } = require('../../../shared/enums');

module.exports = async (data) => {
  const task = await prisma.task.update({
    where: {
      publicId: data.publicId,
    },
    data: {
      isCompleted: true,
    },
  });

  await eventBus.emit({
    name: TaskStreamEvent.Updated,
    data: { task },
  });

  await eventBus.emit({
    name: TaskEvent.Completed,
    data: {
      taskPublicId: task.publicId,
      assigneePublicId: task.assigneePublicId,
    },
  });
};
