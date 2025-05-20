import { Router } from "express";
import { 
  searchAndSaveWeather,
  getUserWeatherHistory
} from "../controllers/weatherController";

const router = Router();

// Buscar clima por ciudad y guardar en historial
router.post("/search", searchAndSaveWeather);

// Obtener historial de clima por email
router.get("/history/:email", getUserWeatherHistory);

export default router;
