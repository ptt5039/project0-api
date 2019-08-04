import express from 'express';
import * as userDao from '../daos/sql-user.dao';

export const authRouter = express();

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userDao.findByUsernameAndPassword(username, password);
    if (user) {
        req.session.user = user;
        res.status(200);
        res.json(user);
    } else {
        req.session.destroy(() => { });
        res.status(400);
        res.send('Invalid Credentials');
    }
});

authRouter.post('/logout', (req, res) => {
    req.session.destroy(() => { });
    res.status(200);
  });

authRouter.get('/check-session', (req, res) => {
    res.json(req.session);
});