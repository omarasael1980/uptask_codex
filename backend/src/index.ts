import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoute from "./routes/projectRoutes";
import cors from "cors";

import authRoute from "./routes/authRoutes";
import colors from "colors";

dotenv.config();
connectDB();

const app = express();

// Middleware y rutas
app.use(cors());
app.use(express.json());
app.use("/api/v1/projects", projectRoute);
app.use("/api/v1/auth", authRoute);
// Emitir solo al usuario agregado

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(colors.bgGreen(`Server is running on http://localhost:${PORT}`));
});

export { app };
