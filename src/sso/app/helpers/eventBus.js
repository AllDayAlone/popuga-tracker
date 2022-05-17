import Producer from "../../../shared/Producer";
import { UserStreamEvent, UserEvent } from "../../../shared/enums";

const topics = [
  { name: 'user-stream', messageNames: Object.values(UserStreamEvent) },
  { name: 'user-events', messageNames: Object.values(UserEvent) },
];

export default new Producer({ topics });
