import { AncientUpdatedEvent, CustomPublisher, Subjects } from "@tagerorg/common";

export class PaymentCreatedPublisher extends CustomPublisher<AncientUpdatedEvent> {
    readonly subject = Subjects.AncientUpdated
}
