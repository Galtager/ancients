import { AncientCreatedEvent, CustomPublisher, Subjects } from "@tagerorg/common";

export class AncientCreatePublisher extends CustomPublisher<AncientCreatedEvent> {
    readonly subject = Subjects.AncientCreated
}
