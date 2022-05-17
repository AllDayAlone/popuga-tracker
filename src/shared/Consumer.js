const { Kafka } = require('kafkajs');

class Consumer {
  constructor({ groupId, topics, eachMessage }) {
    this.kafka = new Kafka({
      brokers: ['localhost:9092'],
    });
    this.consumer = this.kafka.consumer({ groupId });
    this.topics = topics;
    this.eachMessage = eachMessage;
  }

  async run() {
    await this.consumer.connect();

    console.log('Consumer connected to kafka');
    await this.consumer.subscribe({ topics: this.topics });
    await this.consumer.run({

      eachMessage: async ({ topic, partition, message }) => {
        /** @type {{ name: string, data: object }} */
        const command = JSON.parse(message.value);

        console.log(`Received ${command.name} ${topic}[${partition}][${message.offset}]. Start processing...`);

        try {
          await this.eachMessage(command);

          console.log(`Processed ${command.name} ${topic}[${partition}][${message.offset}].`);
        } catch (error) {
          console.log(`Failed to process ${command.name} ${topic}[${partition}][${message.offset}]. Error:`, error);
        }
      },
    });
  }

  start() {
    this.run().catch((e) => console.error(`[example/consumer] ${e.message}`, e));

    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    errorTypes.forEach((type) => {
      process.on(type, async (e) => {
        try {
          console.log(`process.on ${type}`);
          console.error(e);
          await this.consumer.disconnect();
          process.exit(0);
        } catch (_) {
          process.exit(1);
        }
      });
    });

    signalTraps.forEach((type) => {
      process.once(type, async () => {
        try {
          await this.consumer.disconnect();
        } finally {
          process.kill(process.pid, type);
        }
      });
    });
  }
}

module.exports = Consumer;
