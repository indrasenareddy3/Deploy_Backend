import express from 'express';
import "dotenv/config";
import cors from "cors";
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js'

// initialize express app

const app = express()

// Connect Database

await connectDB()

// Middleware

app.use(cors());
app.use(express.json());

// Routes

app.get('/',(req, res)=>res.send("server is running...fine"))
app.use('/api/user', userRouter)
app.use('/api/owner',ownerRouter)
app.use('/api/booking', bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))