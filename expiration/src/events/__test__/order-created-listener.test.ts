import { OrderCreatedEvent, OrderStatus } from "@tagerorg/common"
import { natsWrapper } from "../../nats-wrapper"
import { OrderCreatedListener } from "../listeners/order-created-listener"
import { getMongoGuid } from "../../test/helper"
import { Ancient } from "../../models/ancient"
import { Message } from "node-nats-streaming"

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // create and save ancient
    const ancient = Ancient.build({
        price: 12,
        title: "test",
        userId: "123dasda"
    })
    await ancient.save();
    // create fake data
    const data: OrderCreatedEvent['data'] = {
        id: getMongoGuid(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'test',
        expiresAt: 'test',
        ancient: {
            id: ancient.id,
            price: ancient.price
        }
    }
    // create a fake message
    //  @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { listener, data, msg }

}
it("sets the orderId in the ancient object", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ancient = await Ancient.findById(data.ancient.id);
    expect(ancient?.orderId).toEqual(data.id);

})
it("acks the msg", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

});
it("publishes a ancient updated event", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ancientUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(data.id).toEqual(ancientUpdatedData.orderId);

})