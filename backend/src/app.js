import express from 'express'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import vehicleRoutes from './routes/vehicle.routes.js';
import driverRoutes from './routes/driver.js';

import cors from 'cors'
import fuelLogRoutes from "./routes/fuelLog.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
const app=express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth',authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/fuel-logs", fuelLogRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/drivers", driverRoutes);

export default app