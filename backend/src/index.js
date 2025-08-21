import express from 'express';
import authrouts from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authrouts)

app.listen(PORT, () => {
  console.log('Server is running on port PORT:' + PORT);
  connectDB();
});
