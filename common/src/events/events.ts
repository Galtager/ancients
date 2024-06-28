import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";



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

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        status: OrderStatus;
        userId: string;
        expiresAt: string
        ticket: {
            id: string;
            price: number;
        }
    }
}

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        ticket: {
            id: string;
            price: number;
        }
    }
}