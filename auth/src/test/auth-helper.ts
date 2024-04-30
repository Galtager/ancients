
import { Response } from "supertest";

const getCookie = async (res: Response) => {
    expect(res.get('Set-Cookie')).toBeDefined();
    const coockie = res.get("Set-Cookie")!;
    return coockie;
}
export { getCookie }