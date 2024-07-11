import { AncientUpdatedEvent, CustomPublisher, Subjects } from "@tagerorg/common";

export class ChargeCreatedPublisher extends CustomPublisher<AncientUpdatedEvent> {
    readonly subject = Subjects.AncientUpdated
}
