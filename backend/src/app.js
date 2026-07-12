import express from 'express'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import vehicleRoutes from './routes/vehicle.routes.js';
import driverRoutes from './routes/driver.js';

import cors from 'cors'
const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())


app.use('/api/auth',authRoutes)
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);

export default app