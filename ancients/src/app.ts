import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { NotFoundError, currentUser, errorHandler } from '@tagerorg/common';

import createAncientRouter from './routes/new'
import getAncientRouter from './routes/get'
import findAncientRouter from './routes/find'
import updateAncientRouter from './routes/update'

const app = express();
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}))
app.use(currentUser)

app.use(createAncientRouter);
app.use(getAncientRouter);
app.use(findAncientRouter);
app.use(updateAncientRouter);

app.use(errorHandler);

app.all('*', async () => {
    throw new NotFoundError();
})


export default app;