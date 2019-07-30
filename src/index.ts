import express from 'express';
import { usersRouter } from './routers/users.router';
import { reimbursementsRouter } from './routers/reimbursements.router';
import { sessionMiddleware } from './middleware/session.middleware';
import { authRouter } from './routers/auth.router';
import bodyParser from 'body-parser';

const port = +process.env.PORT;
const app = express();

/**
 * This callback will be invoked anytime a request is made
 * regardless of url or http method
 */
// app.use((req, res, next) => {
//     next();
// });

app.use(bodyParser.json());

/**
 * Session middleware
 */
app.use(sessionMiddleware);


app.use((req, resp, next) => {
  console.log(req.get('host'));
  resp.header('Access-Control-Allow-Origin', `${req.headers.origin}`);
  resp.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  resp.header('Access-Control-Allow-Credentials', 'true');
  resp.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, PATCH');
  next();
});
/**
 *
 */
app.use('/users', usersRouter);
app.use('/reimbursements', reimbursementsRouter);
app.use(authRouter);

app.post('/logout', (req, res) => {
  req.session.destroy(() => { });
  res.send('logout successful!');
});

app.listen(port, () => {
  console.log('app started on port: ' + port);
});