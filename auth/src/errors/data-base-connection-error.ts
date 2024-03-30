import { CustomError } from "./custom-error";

export class DataBaseConnectionError extends CustomError {
    statusCode = 503;
    reason = "Error connecting to database";

    constructor() {
        super("Error connecting to database");
        Object.setPrototypeOf(this, DataBaseConnectionError.prototype)
    }
    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}