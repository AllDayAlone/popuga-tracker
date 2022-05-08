import { TaskCommand } from '../../enums';
import Producer from '../../Producer';

const topics = [
  { name: 'task-commands', commands: Object.values(TaskCommand) },
];

export default new Producer({ topics });
