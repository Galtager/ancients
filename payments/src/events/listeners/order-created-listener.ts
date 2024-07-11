import { CustomListener, OrderCreatedEvent, Subjects } from "@tagerorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends CustomListener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const order = Order.build({
            id: data.id,
            version: data.version,
            price: data.ancient.price,
            status: data.status,
            userId: data.userId
        })
        await order.save();

        msg.ack();
    }
}
