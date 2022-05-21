const server = require('./server');
const userStreamConsumer = require('./consumers/userStreamConsumer');
const taskStreamConsumer = require('./consumers/taskStreamConsumer');
const taskManagementConsumer = require('./consumers/taskManagementConsumer');

const port = 3003;

server.listen(port, () => {
  console.log(`Billing app listening on port ${port}`);
});

userStreamConsumer.start();
taskStreamConsumer.start();
taskManagementConsumer.start();
