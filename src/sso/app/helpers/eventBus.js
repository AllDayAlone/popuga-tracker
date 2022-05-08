import Producer from "../../../shared/Producer";

const UserStream = {
  Created: 'user.created'
}

const topics = [
  { name: 'user-stream', messageNames: Object.values(UserStream) },
];

export default new Producer({ topics });
