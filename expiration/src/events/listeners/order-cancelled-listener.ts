import { CustomListener, OrderCancelledEvent, Subjects } from "@tagerorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ancient } from "../../models/ancient";
import { AncientUpdatePublisher } from "../publishers/ancients-updated-publisher";

export class OrderCancelledListener extends CustomListener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        const ancient = await Ancient.findById(data.ancient.id);

        if (!ancient) {
            throw new Error("Ancient not found");
        }
        ancient.set({ orderId: undefined });
        await ancient.save();
        await new AncientUpdatePublisher(this.client).publish({
            id: ancient.id,
            title: ancient.title!,
            price: ancient.price!,
            userId: ancient.userId!,
            version: ancient.version,
            orderId: ancient.orderId
        });
        msg.ack();
    }
}
