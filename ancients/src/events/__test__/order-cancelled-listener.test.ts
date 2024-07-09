import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@tagerorg/common"
import { natsWrapper } from "../../nats-wrapper"
import { getMongoGuid } from "../../test/helper"
import { Ancient } from "../../models/ancient"
import { Message } from "node-nats-streaming"
import { OrderCancelledListener } from "../listeners/order-cancelled-listener"

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    // create and save ancient
    const ancient = Ancient.build({
        price: 12,
        title: "test",
        userId: "123dasda"
    })
    ancient.set({ orderId: getMongoGuid() })
    await ancient.save();
    // create fake data
    const data: OrderCancelledEvent['data'] = {
        id: getMongoGuid(),
        version: 0,
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
it("updates the ancient, publishes an event, and acks the msg", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedAncient = await Ancient.findById(data.ancient.id);
    expect(updatedAncient?.orderId).toBeUndefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})

