import express from "express";
import { createExpense, getExpenses } from "../controllers/expense.controller.js";

const router = express.Router();

router.get("/",  getExpenses);   // GET  /api/expenses
router.post("/", createExpense); // POST /api/expenses

export default router;
