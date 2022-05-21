const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(bodyParser.json());

const prisma = new PrismaClient();

app.get('/balance', async (req, res) => {
  const { _sum: { income, charge } } = await prisma.transaction.aggregate({
    _sum: { income: true, charge: true },
  });

  res.send({ balance: income - charge });
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

app.get('/billing-cycle/next', async (req, res) => {
  const currentBillingCycle = await prisma.billingCycle.findFirst({
    where: { state: 'open' },
    orderBy: { id: 'desc' },
  });
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
