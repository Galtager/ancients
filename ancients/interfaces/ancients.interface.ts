export type Ancient = {
    title: string,
    price: number,
    userId: string
}
export type AncientDto = Omit<Ancient, "userId">
