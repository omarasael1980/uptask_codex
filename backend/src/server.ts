import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoute from "./routes/projectRoutes";
import cors from "cors";
import { corsOptions } from "./config/cors";
import authRoute from "./routes/authRoutes";
import { Server } from "socket.io";
import { createServer } from "http";
import colors from "colors";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app); // Usa la misma instancia de app
const io = new Server(server, {
  cors: {
    origin: "*", // Ajusta si es necesario
    methods: ["GET", "POST"],
  },
});

// Middleware y rutas
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/projects", projectRoute);
app.use("/api/v1/auth", authRoute);

// WebSockets
io.on("connection", (socket) => {
  console.log(
    colors.bgBlue(`Conectado al servidor WebSocket con ID: ${socket.id}`)
  );

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(colors.bgGreen(`Server is running on http://localhost:${PORT}`));
});

export { app, server, io };
