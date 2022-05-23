const { PrismaClient } = require('@prisma/client');
const Consumer = require('../../../shared/Consumer');
const { TaskEvent, BillingEvent } = require('../../../shared/enums');
const eventBus = require('../eventBus');

const prisma = new PrismaClient();

const handlers = {
  [TaskEvent.Assigned]: async ({ taskPublicId, assigneePublicId }) => {
    const task = await prisma.task.findUnique({
      where: { taskPublicId },
    });
    const billingCycle = await prisma.billingCycle.findFirst({
      where: { state: 'open' },
      orderBy: { id: 'desc' },
    });

    const transaction = await prisma.transaction.create({
      data: {
        account: {
          connect: {
            userPublicId: assigneePublicId,
          },
        },
        billingCycle: {
          connect: {
            id: billingCycle.id,
          },
        },
        task: {
          connect: {
            taskPublicId,
          },
        },
        type: 'assign_fee',
        income: 0,
        charge: task.assignCost,
      },
    });

    await eventBus.emit({
      name: BillingEvent.PayoutSent,
      data: {
        userPublicId: assigneePublicId,
        billingCycleDate: billingCycle.from,
        amount: transaction.charge,
      },
    });
  },
  [TaskEvent.Completed]: async ({ taskPublicId, assigneePublicId }) => {
    const task = await prisma.task.findUnique({
      where: { taskPublicId },
    });
    const billingCycle = await prisma.billingCycle.findFirst({
      where: { state: 'open' },
      orderBy: { id: 'desc' },
    });

    const transaction = await prisma.transaction.create({
      data: {
        account: {
          connect: {
            userPublicId: assigneePublicId,
          },
        },
        billingCycle: {
          connect: {
            id: billingCycle.id,
          },
        },
        task: {
          connect: {
            taskPublicId,
          },
        },
        type: 'bounty',
        income: task.bountyCost,
        charge: 0,
      },
    });

    await eventBus.emit({
      name: BillingEvent.PayoutSent,
      data: {
        userPublicId: assigneePublicId,
        billingCycleDate: billingCycle.from,
        amount: transaction.income,
      },
    });
  },
};

const consumer = new Consumer({
  groupId: 'billing-task-management-consumer',
  topics: ['task-events'],
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
