import { CustomListener, OrderCancelledEvent, OrderStatus, Subjects } from "@tagerorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends CustomListener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!order) {
            throw new Error("Order not found")
        }
        order.set({ status: OrderStatus.Cacncelled })
        await order.save()
        msg.ack();
    }
}
