import express from 'express';
import controller from './users.controller.js';

const router = express.Router();

router.post('/',controller.login);
router.get('/', controller.getAll);
router.get('/:id',controller.getUser);
router.put('/:id',controller.updateUser);
router.delete('/:id',controller.deleteUser);
router.get('/:id/logout',controller.logout);
router.post('/:id/deposite',controller.depositeMoney);
router.post('/:id/withdraw',controller.withdrawMoney);
router.post('/:id/transfer',controller.transferMoney);
router.post('/:id/transaction_history',controller.allTransactionHistory)



export default router;