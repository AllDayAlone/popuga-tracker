const { Kafka } = require('kafkajs');
const { v4: uuid } = require('uuid');

class Producer {
  constructor({ topics }) {
    this.kafka = new Kafka({ brokers: ['localhost:9092'] });
    this.producer = this.kafka.producer();

    this.topics = topics;

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

  async emit(command) {
    const topic = this.getTopic(command.name);
    const message = {
      key: command.key ?? uuid(),
      value: JSON.stringify(command),
    };

    await this.producer.connect();
    await this.producer.send({ topic, messages: [message] });

    console.log(`Pushed ${command.name} to ${topic}`);
    await this.producer.disconnect();

    return message;
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
