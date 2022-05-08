const { Kafka } = require('kafkajs');
const { v4: uuid } = require('uuid');

class Producer {
  constructor({ topics }) {
    this.kafka = new Kafka({ brokers: ['localhost:9092'] });
    this.producer = this.kafka.producer();

    this.topics = topics;
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

    const topic = this.topics.find(({ commands }) => commands.includes(commandName));

    if (!topic) {
      throw new Error(`Could not find topic for command name: ${commandName}`);
    }

    return topic.name;
  }
}

module.exports = Producer;
