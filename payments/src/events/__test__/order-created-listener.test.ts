import { OrderCreatedEvent, OrderStatus } from "@tagerorg/common"
import { natsWrapper } from "../../nats-wrapper"
import { OrderCreatedListener } from "../listeners/order-created-listener"
import { getMongoGuid } from "../../test/helper"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // create fake data
    const data: OrderCreatedEvent['data'] = {
        id: getMongoGuid(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'test',
        expiresAt: 'test',
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
it("replicates the order info", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order!.id).toEqual(data.id);
    expect(order!.price).toEqual(data.ancient.price);

})
it("acks the msg", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

});
