import { CustomListener, OrderCreatedEvent, Subjects } from "@tagerorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ancient } from "../../models/ancient";

export class OrderCreatedListener extends CustomListener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const ancient = await Ancient.findById(data.ancient.id);
        if (!ancient) {
            throw new Error("Ancient not found");
        }
        ancient.set({ orderId: data.id });
        await ancient.save();

        msg.ack();

    }
}
