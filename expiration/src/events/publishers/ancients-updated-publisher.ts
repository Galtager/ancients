import { AncientUpdatedEvent, CustomPublisher, Subjects } from "@tagerorg/common";

export class AncientUpdatePublisher extends CustomPublisher<AncientUpdatedEvent> {
    readonly subject = Subjects.AncientUpdated
}
