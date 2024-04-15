import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export class Password {


    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = await this.getBuffer(password, salt)
        return `${buf.toString('hex')}.${salt}`
    }
    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.')
        const buf = await this.getBuffer(suppliedPassword, salt)
        return buf.toString('hex') === hashedPassword;
    }

    private static async getBuffer(password: string, salt: string) {
        return await scryptAsync(password, salt, 64) as Buffer;
    }

}