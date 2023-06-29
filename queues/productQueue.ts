import amqp, { Channel } from "amqplib";

let channel: Channel;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");
}
connect().then(() => {
  // channel.deleteQueue("PRODUCT");
});

export const sendMessage = (queueName: string, data: {}) => {
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};

export const receiveMessage = (queueName: string) => {
  const receivePromise = new Promise(async (resolve, reject) => {
    try {
      await channel.consume(queueName, (data: any) => {
        const content = JSON.parse(data?.content);
        channel.ack(data);
        resolve(content);
      });
    } catch (err) {
      reject(err);
    }
  });
  return receivePromise;
};
