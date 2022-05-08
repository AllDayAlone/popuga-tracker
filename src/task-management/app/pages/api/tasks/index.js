import { PrismaClient } from '@prisma/client';
import commandBus from '../../../helpers/commandBus';
import { TaskCommand } from '../../../../enums';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const command = await commandBus.emit({
        name: TaskCommand.Add,
        data: {
          title: req.body.title
        }
      })
      res.redirect('/tasks');
      break;
    case 'GET':
      const tasks = await prisma.task.findMany({
        include: {
          assignee: true,
        },
        orderBy: [{
          isCompleted: 'asc',
        }, {
          title: 'asc'
        }],
      });
      res.status(200).json({ tasks });
      break;
  }
}
