import { OrderCancelledEvent, OrderStatus } from "@tagerorg/common"
import { natsWrapper } from "../../nats-wrapper"
import { getMongoGuid } from "../../test/helper"
import { Message } from "node-nats-streaming"
import { OrderCancelledListener } from "../listeners/order-cancelled-listener"
import { Order } from "../../models/order"

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = getMongoGuid()
    const order = Order.build({
        id: orderId,
        price: 20,
        version: 0,
        userId: 'dsd',
        status: OrderStatus.Created
    })
    await order.save()

    // create fake data
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ancient: {
            id: getMongoGuid(),
            price: 20
        }
    }
    // create a fake message
    //  @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { listener, data, msg }


}
it("change the status of the order, and acks the msg", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order?.status).toEqual(OrderStatus.Cacncelled);
    expect(msg.ack).toHaveBeenCalled();

})

