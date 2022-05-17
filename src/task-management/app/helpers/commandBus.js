import { TaskCommand } from '../../../shared/enums';
import Producer from '../../../shared/Producer';

const topics = [
  { name: 'task-commands', messageNames: Object.values(TaskCommand) },
];

export default new Producer({ topics });
