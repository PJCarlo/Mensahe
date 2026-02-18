import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouts from './routes/auth.route.js';
import messageRouts from './routes/messages.route.js';
import locationRoutes from "./routes/location.route.js";
import { connectDB } from './lib/db.js';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "16mb" }));
app.use(cookieParser());
app.use(cors({  
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRouts);
app.use("/api/messages", messageRouts);
app.use("/api/location", locationRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port PORT:' + PORT);
  connectDB();
});

console.log("process.env.TZ:", process.env.TZ);
console.log("Local time:", new Date().toString());