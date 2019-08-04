import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as reimbursementDao from '../daos/sql-reimbursement.dao';

export const reimbursementsRouter = express.Router();

reimbursementsRouter.get('/status/:statusId', [authMiddleware('finance-manager', 'admin'), async (req, res) => {
    const reimbursements = await reimbursementDao.findReimbursementByStatusId(req);
    res.json(reimbursements);
}]);

reimbursementsRouter.get('/status', async (req, res) => {
    const statuses = await reimbursementDao.getStatus();
    res.json(statuses);
});

reimbursementsRouter.get('/type', async (req, res) => {
    const types = await reimbursementDao.getType();
    res.json(types);
});

reimbursementsRouter.get('/:id', [authMiddleware('finance-manager', 'admin', 'associate'), async (req, res) => {
    const reimbursement = await reimbursementDao.findReimbursementById(+req.params.id);
    res.json(reimbursement);
}]);

reimbursementsRouter.get('/author/userId/:id', [authMiddleware('finance-manager', 'admin'), async (req, res) => {
    const reimbursements = await reimbursementDao.findReimbursementByUserId(+req.params.id);
    res.json(reimbursements);
}]);

reimbursementsRouter.patch('', [authMiddleware('finance-manager', 'admin'), async (req, res) => {
    const reimbursement = await reimbursementDao.updateReimbursement(req.body);
    res.json(reimbursement);
}]);

reimbursementsRouter.post('', async (req, res) => {
    req.body.author.userId = req.session.user.userId;
    const reimbursement = await reimbursementDao.createReimbursement(req.body);
    if (reimbursement) {
        res.status(201);
        res.json(reimbursement);
    } else {
        res.sendStatus(400);
    }
});