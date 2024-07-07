import { AncientCreatedEvent } from "@tagerorg/common"
import { natsWrapper } from "../../../nats-wrapper"
import { AncientCreatedListener } from "../ancient-created-listener"
import { getMongoGuid } from "../../../test/helper"
import { Message } from "node-nats-streaming"
import { Ancient } from "../../../models/ancient"

const setup = async () => {
    // create an instance of the listener
    const listener = new AncientCreatedListener(natsWrapper.client)
    // create fake data event
    const data: AncientCreatedEvent['data'] = {
        id: getMongoGuid(),
        title: "123",
        version: 0,
        price: 12,
        userId: getMongoGuid(),

    }
    // create a fake message
    //  @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { listener, data, msg }

}
it("creates and saves a anicent", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function
    await listener.onMessage(data, msg);
    // write assertions to make sure a ancient was created!
    const ancient = await Ancient.findById(data.id);
    expect(ancient).toBeDefined()
    expect(ancient!.title).toEqual(data.title)
    expect(ancient!.price).toEqual(data.price)
})
it("acks the message", async () => {
    // call the onMessage function
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    // write assertions to make sure ack was called
    expect(msg.ack).toHaveBeenCalled()

})