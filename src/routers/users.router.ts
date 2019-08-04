import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as userDao from '../daos/sql-user.dao';

export const usersRouter = express.Router();

usersRouter.get('', [authMiddleware('finance-manager', 'admin'), async (req, res) => {
    const users = await userDao.findAll();
    res.json(users);
}]);

usersRouter.get('/:id', [authMiddleware('finance-manager', 'admin'),
async (req, res) => {
    const user = await userDao.findById(+req.params.id);
    res.json(user);
}]);



usersRouter.patch('', [authMiddleware('admin'),
async (req, res) => {
    const user = await userDao.updateUser(req.body);
    if (user) {
        req.session.user = user;
        res.json(user);
    }

}]);