const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const eventBus = require('./eventBus');
const { BillingEvent } = require('../../shared/enums');

const app = express();
app.use(bodyParser.json());

const prisma = new PrismaClient();
const emailService = { send: console.log }; // Mock

async function getWorkerBalance(workerPublicId) {
  const { _sum: { income, charge } } = await prisma.transaction.aggregate({
    where: {
      account: {
        userPublicId: workerPublicId,
      },
    },
    _sum: { income: true, charge: true },
  });

  return income - charge;
}

app.get('/users', async (req, res) => {
  const currentBillingCycle = await prisma.billingCycle.findFirst({
    where: { state: 'open' },
    orderBy: { id: 'desc' },
  });
  const groupByResult = await prisma.transaction.groupBy({
    by: ['accountId'],
    _sum: { income: true, charge: true },
  });
  const users = await Promise.all(groupByResult.map(async ({ _sum, accountId }) => {
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    const transactions = await prisma.transaction.findMany({
      where: {
        billingCycleId: currentBillingCycle.id,
        accountId: account.id,
      },
      include: {
        task: true,
        billingCycle: true,
      },
    });

    return {
      name: account.userName,
      userPublicId: account.userPublicId,
      balance: _sum.income - _sum.charge,
      transactions,
    };
  }));

  res.send(users);
});

app.get('/balance', async (req, res) => {
  const currentBillingCycle = await prisma.billingCycle.findFirst({
    where: { state: 'open' },
    orderBy: { id: 'desc' },
  });
  const { _sum: { income, charge } } = await prisma.transaction.aggregate({
    where: { billingCycleId: currentBillingCycle.id },
    _sum: { income: true, charge: true },
  });

  res.send({ amount: income - charge });
});

app.get('/balance/:workerPublicId', async (req, res) => {
  const { _sum: { income, charge } } = await prisma.transaction.aggregate({
    where: {
      account: {
        userPublicId: req.params.workerPublicId,
      },
    },
    _sum: { income: true, charge: true },
  });

  res.send({ balance: income - charge });
});

app.get('/audit/:workerPublicId', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      account: {
        userPublicId: req.params.workerPublicId,
      },
    },
  });

  res.send(transactions);
});

app.get('/billing-cycle', async (req, res) => {
  const currentBillingCycle = await prisma.billingCycle.findFirst({
    where: { state: 'open' },
    orderBy: { id: 'desc' },
  });

  res.send(currentBillingCycle);
});

app.post('/billing-cycle/close', async (req, res) => {
  const currentBillingCycle = await prisma.billingCycle.findFirst({
    where: { state: 'open' },
    orderBy: { id: 'desc' },
  });

  const workerAccounts = await prisma.account.findMany();

  await Promise.all(workerAccounts.map(async (account) => {
    const balance = await getWorkerBalance(account.userPublicId);

    if (balance <= 0) {
      return null;
    }

    const payoutTransaction = await prisma.transaction.create({
      data: {
        billingCycle: {
          connect: {
            id: currentBillingCycle.id,
          },
        },
        account: {
          connect: {
            id: account.id,
          },
        },
        type: 'payout',
        income: 0,
        charge: balance,
      },
    });

    await eventBus.emit({
      name: BillingEvent.PayoutSent,
      data: {
        userPublicId: account.userPublicId,
        billingCycleDate: currentBillingCycle.from,
        amount: payoutTransaction.charge,
      },
    });

    await emailService.send({ userPublicId: account.userPublicId, amount: balance });

    return payoutTransaction;
  }));

  await prisma.billingCycle.update({
    where: { id: currentBillingCycle.id },
    data: { state: 'closed' },
  });
  const nextBillingCycle = await prisma.billingCycle.create({
    data: {
      from: currentBillingCycle.to,
      to: new Date(new Date(currentBillingCycle.to).valueOf() + 86400000),
      state: 'open',
    },
  });

  res.send(nextBillingCycle);
});

module.exports = app;
