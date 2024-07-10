import { ExpirationCompleteEvent, CustomPublisher, Subjects } from "@tagerorg/common";

export class ExpirationCompletePublisher extends CustomPublisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}
