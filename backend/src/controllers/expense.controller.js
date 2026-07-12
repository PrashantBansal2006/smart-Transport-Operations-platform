import Expense from "../model/Expense.js";

export const createExpense = async (req, res) => {
  try {
    const { vehicleId, tripId, type, amount, date } = req.body;

    if (!vehicleId || !type || !amount) {
      return res.status(400).json({ success: false, message: "vehicleId, type and amount are required" });
    }

    const expense = await Expense.create({
      vehicleId,
      tripId,  // optional
      type,
      amount,
      date: date || Date.now(),
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.log("createExpense error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("vehicleId", "registrationNumber model")
      .populate("tripId")
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    console.log("getExpenses error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
