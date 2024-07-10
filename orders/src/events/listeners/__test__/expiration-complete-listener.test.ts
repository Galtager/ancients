import { ExpirationCompleteEvent, OrderStatus } from "@tagerorg/common"
import { natsWrapper } from "../../../nats-wrapper"
import { createAncient, createOrder } from "../../../test/helper"
import { Message } from "node-nats-streaming"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order } from "../../../models/order"

const setup = async () => {
    // create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    // create fake data event
    const ancient = await createAncient({ title: 'test', price: 20 })
    const order = await createOrder(ancient.id)

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.body.id
    }
    // create a fake message
    //  @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { listener, data, msg }

}
it("updates the order status to cancelled", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ancient = await Order.findById(data.orderId);
    expect(ancient!.status).toEqual(OrderStatus.Cacncelled)
})
it("emit an OrderCancelled event", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled()
    const eventData = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
    expect(JSON.parse(eventData).id).toEqual(data.orderId)

})
it("ack the msg", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
})