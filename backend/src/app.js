import express from 'express'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import vehicleRoutes from './routes/vehicle.routes.js';
import maintenceRoutes from './routes/maintenanceRoutes.js'
import driverRoutes from './routes/driver.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/reports.js';
import tripRoutes from './routes/trip.route.js'

import cors from 'cors'
import fuelLogRoutes from "./routes/fuelLog.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/fuel-logs", fuelLogRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/trips", tripRoutes)

export default app
