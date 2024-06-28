import { CustomPublisher, OrderCancelledEvent, Subjects } from "@tagerorg/common";

export class OrderCancelledPublisher extends CustomPublisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}
