import amqp, { ConsumeMessage } from 'amqplib';
import Commande from './model/commandeModel';

export async function consumeOrders() {
    const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
    const channel = await connection.createChannel();
    const exchange = 'events';
    const queue = 'orders_queue';

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertQueue(queue, { durable: true, autoDelete: false });
    await channel.bindQueue(queue, exchange, 'order.*');

    console.log(`Waiting for messages in ${queue}...`);
    channel.consume(queue, async (msg: ConsumeMessage | null ) => {
        if (msg) {
            const event = JSON.parse(msg.content.toString());
            console.log(`Received on ${queue} [${msg.fields.routingKey}]:`, event);

        try {
            await Commande.create({
            id_commande: event.orderId,
            id_produit: event.productId,
            id_client: event.clientId,
            date_commande: event.date || new Date(),
            });
            console.log('✅ Commande insérée en DB');
        } catch (err) {
            console.error('❌ Erreur insertion DB:', err);
        }
            channel.ack(msg);
        }
    });
}

consumeOrders();
