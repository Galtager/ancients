import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from '@tagerorg/common';


const app = express();
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}))

// routers

app.get('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;