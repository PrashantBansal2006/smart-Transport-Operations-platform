import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/lib/db.js";
import vehicleRoutes from "./src/routes/vehicle.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);

app.get("/", (req, res) => {
  res.json({ message: "TransitOps API is running 🚛" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

