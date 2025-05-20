import { Router } from "express";
import { searchAndSaveWeather,getUserWeatherHistory } from "../controllers/weatherController";

const router = Router();

router.post("/search", searchAndSaveWeather);
router.get("/history/:email", getUserWeatherHistory); //


export default router;
