import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(
      colors.magenta.bold(
        `MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`
      )
    );
  } catch (error) {
    console.error(colors.bgRed(`Error: No se pudo conectar a MongoDB`));
    console.error(colors.red(error));
    process.exit(1);
  }
};
