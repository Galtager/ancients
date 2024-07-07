import { AncientUpdatedEvent, CustomListener, Subjects } from "@tagerorg/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ancient } from "../../models/ancient";

export class AncientUpdatedListener extends CustomListener<AncientUpdatedEvent> {
    readonly subject = Subjects.AncientUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: AncientUpdatedEvent['data'], msg: Message) {
        const { title, price, id } = data;
        const ancient = await Ancient.findById(id);
        if (!ancient) {
            throw new Error('Ancient nor found')
        }
        ancient.set({ title, price })
        await ancient.save();
        msg.ack()
    }
}
