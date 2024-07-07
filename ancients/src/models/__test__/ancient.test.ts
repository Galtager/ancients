import { createAncient } from "../../test/helper"
import { Ancient } from "../ancient";

it('implements optimistic concurrency control', async () => {
    // Create an instance of a ancient
    // Save the ancient to DB 
    const response = await createAncient({ title: "test", price: 5 });
    //fetch ancient twice
    const firstInstance = await Ancient.findById(response.body.id)
    const secondInstance = await Ancient.findById(response.body.id)
    // make 2 seperate changes to the ancients
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // saved the first fetched ancient
    await firstInstance!.save();
    // save the second fetched ancient and excpet error 
    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    }
    throw new Error("Should not reach this point")
});
it('increments the version number on multiple saves', async () => {
    const response = await createAncient({ title: "test", price: 5 });

    const firstInstance = await Ancient.findById(response.body.id);
    expect(firstInstance!.version).toEqual(0);

    await firstInstance!.save();
    expect(firstInstance!.version).toEqual(1);

    await firstInstance!.save();
    expect(firstInstance!.version).toEqual(2);

});