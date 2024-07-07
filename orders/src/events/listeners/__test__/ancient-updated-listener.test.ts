import { AncientCreatedEvent, AncientUpdatedEvent } from "@tagerorg/common"
import { natsWrapper } from "../../../nats-wrapper"
import { AncientCreatedListener } from "../ancient-created-listener"
import { createAncient, getMongoGuid } from "../../../test/helper"
import { Message } from "node-nats-streaming"
import { Ancient } from "../../../models/ancient"
import { AncientUpdatedListener } from "../ancient-updated-listener"

const setup = async () => {
    const ancient = await createAncient({ title: "test", price: 10 })
    // create an instance of the listener
    const listener = new AncientUpdatedListener(natsWrapper.client)
    // create fake data event
    const data: AncientUpdatedEvent['data'] = {
        id: ancient.id,
        title: "updated test",
        version: ancient.version + 1,
        price: 999,
        userId: getMongoGuid(),
    }
    // create a fake message
    //  @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }
    return { listener, data, msg }

}
it("finds, updates, and saves an ancient", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function
    await listener.onMessage(data, msg);
    // write assertions to make sure a ancient was created!
    const updatedAncient = await Ancient.findById(data.id);
    expect(updatedAncient).toBeDefined();
    expect(updatedAncient!.title).toEqual(data.title)
    expect(updatedAncient!.price).toEqual(data.price)
    expect(updatedAncient!.version).toEqual(data.version)
})
it("acks the message", async () => {
    // call the onMessage function
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    // write assertions to make sure ack was called
    expect(msg.ack).toHaveBeenCalled()

})

it("does not call ack if the event has a skipped version number", async () => {
    // call the onMessage function
    const { listener, data, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (error) {

    }
    // write assertions to make sure ack was called
    expect(msg.ack).not.toHaveBeenCalled()

})