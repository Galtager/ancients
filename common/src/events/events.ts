import { Subjects } from "./subjects";



export interface AncientCreatedEvent {
    subject: Subjects.AncientCreated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string
    }
}
export interface AncientUpdatedEvent {
    subject: Subjects.AncientUpdated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string
    }
}