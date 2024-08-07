import { CustomListener, OrderCreatedEvent, Subjects } from "@tagerorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/queue";

export class OrderCreatedListener extends CustomListener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add({ orderId: data.id }, {
            delay
        });
        msg.ack();
    }
}
