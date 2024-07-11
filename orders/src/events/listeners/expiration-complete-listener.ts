import { AncientCreatedEvent, CustomListener, ExpirationCompleteEvent, OrderStatus, Subjects } from "@tagerorg/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ancient } from "../../models/ancient";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/ancients-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends CustomListener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

        const order = await Order.findById(data.orderId).populate("ancient");

        if (!order) {
            throw new Error("Order not found")
        }
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({ status: OrderStatus.Cacncelled })
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ancient: {
                id: order.ancient.id,
                price: order.ancient.price
            }
        })
        msg.ack()
    }
}
