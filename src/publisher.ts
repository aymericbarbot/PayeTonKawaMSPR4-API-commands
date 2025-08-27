import amqp from 'amqplib';

export async function publishOrderEvent(eventType: string, payload: any) {
    const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
    const channel = await connection.createChannel();
    const exchange = 'events';

    await channel.assertExchange(exchange, 'topic', { durable: true });
    channel.publish(exchange, eventType, Buffer.from(JSON.stringify(payload)));
    console.log(`Order Event published: ${eventType}`, payload);

    await channel.close();
    await connection.close();
}

// Exemple
(async () => {
    await publishOrderEvent('order.created', { orderId: 1, clientId: 100 });
})();
