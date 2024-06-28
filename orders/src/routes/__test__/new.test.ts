import { createAncient, createOrder, getMongoGuid } from "../../test/helper";


it('returns error if the ancient doesnot exist', async () => {
    const ancientId = getMongoGuid();
    await createOrder(ancientId).expect(404)
})
it('reserved a ancient', async () => {
    const ancient = await createAncient({ price: 12, title: "test" });
    await createOrder(ancient.id).expect(201)
})
it('returns error if the ancient is already reserved', async () => {
    const ancient = await createAncient({ price: 12, title: "test" });
    await createOrder(ancient.id).expect(201)
    await createOrder(ancient._id).expect(400)
})

it.todo("emits an order created event")