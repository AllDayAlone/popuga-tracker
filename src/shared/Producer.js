const { Kafka } = require('kafkajs');
const { v4: uuid } = require('uuid');

let validateEvent;

if (module.path) {
  validateEvent = require('../schema-registry/src/validateEvent');
} else {
  validateEvent = require('../schema-registry/dist/src/validateEvent').default;
}

class Producer {
  constructor({ producerName, topics }) {
    this.kafka = new Kafka({ brokers: ['localhost:9092'] });
    this.producer = this.kafka.producer();

    this.topics = topics;
    this.producerName = producerName;

    if (!topics) {
      throw new Error('Provide topics for producer');
    }

    if (!Array.isArray(topics)) {
      throw new Error('Topics should be array');
    }

    topics.forEach((topic) => {
      if (!topic.name) {
        throw new Error('Topic should have a name');
      }
      if (!topic.messageNames || !Array.isArray(topic.messageNames)) {
        throw new Error(`Topic ${topic.name} is missing array of message names`);
      }
    });
  }

  async emit({
    id, name, data, version,
  } = {}) {
    const event = {
      eventId: id ?? uuid(),
      eventVersion: version ?? 1,
      eventName: name,
      eventTime: new Date(),
      producer: this.producerName,
      data,
    };
    const validationResult = validateEvent(event, event.eventName, { version });

    if (validationResult.failure) {
      console.log(`Failed to send event ${event.eventName}`, validationResult.failure, event);
      return;
    }

    const topic = this.getTopic(event.eventName);
    const message = {
      key: event.eventId,
      value: JSON.stringify(event),
    };

    await this.producer.connect();
    await this.producer.send({ topic, messages: [message] });

    console.log(`Pushed ${event.eventName} to ${topic}`);
    await this.producer.disconnect();
  }

  getTopic(commandName) {
    if (!commandName) {
      throw new Error('Command name was not provided');
    }

    const topic = this.topics.find(({ messageNames }) => messageNames.includes(commandName));

    if (!topic) {
      throw new Error(`Could not find topic for command name: ${commandName}`);
    }

    return topic.name;
  }
}

module.exports = Producer;
