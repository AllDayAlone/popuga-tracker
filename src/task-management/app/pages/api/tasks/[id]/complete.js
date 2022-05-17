import commandBus from '../../../../helpers/commandBus';
import { TaskCommand } from '../../../../../../shared/enums';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const command = await commandBus.emit({
        name: TaskCommand.Complete,
        data: {
          publicId: req.query.id,
        }
      });

      res.status(200).json({ command });
      break;
  }
}
