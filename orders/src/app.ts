import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { NotFoundError, currentUser, errorHandler } from '@tagerorg/common';

import createOrderRouter from './routes/new'
import getOrderRouter from './routes/get'
import findOrderRouter from './routes/find'
import deleteOrderRouter from './routes/delete'

const app = express();
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}))
app.use(currentUser)

app.use(createOrderRouter);
app.use(getOrderRouter);
app.use(findOrderRouter);
app.use(deleteOrderRouter);

app.use(errorHandler);

app.all('*', async () => {
    throw new NotFoundError();
})


export default app;