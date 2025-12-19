import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/DbConnection.js';
import authRoutes from './routes/auth.routes.js';
import petRoutes from './routes/pet.routes.js';
import approveViewRoutes from './routes/adopted.approval.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path';

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE;

// Connect to MongoDB database
connectDB(DATABASE);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/approveView', approveViewRoutes);

app.use("/PetUploadPhoto", express.static(path.join("PetUploadPhoto")));

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

