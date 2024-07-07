import { AncientCreatedEvent, CustomListener, Subjects } from "@tagerorg/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ancient } from "../../models/ancient";

export class AncientCreatedListener extends CustomListener<AncientCreatedEvent> {
    readonly subject = Subjects.AncientCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: AncientCreatedEvent['data'], msg: Message) {
        const { title, price, id } = data;
        const ancient = Ancient.build({
            title, price, id
        })
        await ancient.save();
        msg.ack()
    }
}
