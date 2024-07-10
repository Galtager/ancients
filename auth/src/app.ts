import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import currentUserRouter from './routes/current-user';
import signinRouter from './routes/signin';
import signoutRouter from './routes/signout';
import signupRouter from './routes/signup';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from '@tagerorg/common';


const app = express();
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    httpOnly: true,
}))

// routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;