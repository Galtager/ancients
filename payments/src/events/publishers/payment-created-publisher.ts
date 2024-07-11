import { CustomPublisher, PaymentCreatedEvent, Subjects } from "@tagerorg/common";

export class PaymentCreatedPublisher extends CustomPublisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
}
