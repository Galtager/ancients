import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";



export interface AncientCreatedEvent {
    subject: Subjects.AncientCreated;
    data: {
        id: string;
        title: string;
        version: number;
        price: number;
        userId: string
    }
}
export interface AncientUpdatedEvent {
    subject: Subjects.AncientUpdated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
        orderId?: string;
    }
}

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        version: number;
        status: OrderStatus;
        userId: string;
        expiresAt: string
        ancient: {
            id: string;
            price: number;
        }
    }
}

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        version: number;
        ancient: {
            id: string;
            price: number;
        }
    }
}
export interface ExpirationCompleteEvent {
    subject: Subjects.ExpirationComplete;
    data: {
        orderId: string;
    }
}