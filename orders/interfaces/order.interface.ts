export type Order = {
    title: string,
    price: number,
    userId: string
}
export type OrderDto = Omit<Order, "userId">
