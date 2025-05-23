import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { json } from "body-parser";
import authRoutes from "./routes/authRoutes";
import weatherRoutes from "./routes/weatherRoutes";


const app = express();
const PORT = process.env.PORT || 8080;

console.log("🔥 PORT en ejecución:", process.env.PORT);


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);

// rutas (luego las importas aquí)
// app.use('/api/auth', authRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log("✅ DB conectada, arrancando servidor...");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar DB", err);
    process.exit(1); // ← Muy importante
  });
