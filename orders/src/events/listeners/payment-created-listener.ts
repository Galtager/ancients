import { CustomListener, OrderStatus, PaymentCreatedEvent, Subjects } from "@tagerorg/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends CustomListener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const { orderId } = data;
        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error("Order not found")
        }

        order.set({ status: OrderStatus.Complete })
        await order.save();

        msg.ack()
    }
}
