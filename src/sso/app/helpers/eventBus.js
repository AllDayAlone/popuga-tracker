import Producer from "../../shared/Producer";

const UserStream = {
  Created: 'user.created'
}

const topics = [
  { name: 'user-stream', commands: Object.values(UserStream) },
];

export default new Producer({ topics });
