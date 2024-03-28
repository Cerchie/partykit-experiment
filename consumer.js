const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

const kafka = new Kafka({
    clientId: "github-app",
    brokers: ['pkc-921jm.us-east-2.aws.confluent.cloud:9092'],
    ssl: true,
    sasl: {
      mechanism: 'plain', // scram-sha-256 or scram-sha-512
      username: CONFLUENT_API_KEY,
      password: CONFLUENT_API_SECRET
    },
});

export const consumer = kafka.consumer({ groupId: "github-group" });