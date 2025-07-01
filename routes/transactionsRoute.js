import express from 'express';
import {getTransactionsbyUserId, searchTransactions, createTransaction, deleteTransaction, getTransactionSummary } from '../controllers/transactionsController.js';

export const router = express.Router();

router.get("/:userId", getTransactionsbyUserId);
router.get("/", searchTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTransactionSummary);
// router.get("/:userId", getTransactionsbyUserId);
// router.get("/", searchTransactions);
// router.post("/", createTransaction);
// router.delete("/:id", deleteTransaction);
// router.get("/summary/:userId", getTransactionSummary);

export default router;
