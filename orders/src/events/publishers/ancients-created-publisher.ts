import { CustomPublisher, OrderCreatedEvent, Subjects } from "@tagerorg/common";

export class OrderCreatePublisher extends CustomPublisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}
