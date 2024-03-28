const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

const kafka = new Kafka({
    clientId: "github-app",
    brokers: ['pkc-921jm.us-east-2.aws.confluent.cloud:9092'],
    ssl: true,
    sasl: {
      mechanism: 'plain', // scram-sha-256 or scram-sha-512
      username: process.env.CONFLUENT_API_KEY,
      password: process.env.CONFLUENT_API_SECRET
    },
});

export const consumer = kafka.consumer({ groupId: "partykitties" });
export const producer = kafka.producer();