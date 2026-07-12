import express from 'express'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())


app.use('/api/auth',authRoutes)

export default app
