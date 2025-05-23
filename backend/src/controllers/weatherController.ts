import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Weather } from "../models/Weather";
import { User } from "../models/User";
import axios from "axios";

const weatherRepo = AppDataSource.getRepository(Weather);
const userRepo = AppDataSource.getRepository(User);

// Interfaz para tipar correctamente la respuesta de OpenWeatherMap
interface WeatherApiResponse {
  name: string;
  weather: { description: string; icon: string }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

export const searchAndSaveWeather = async (req: Request, res: Response) => {
  const { city, email } = req.body;

  if (!city || !email) {
    return res.status(400).json({ message: "Ciudad y email son requeridos" });
  }

  try {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "API_KEY no configurada" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get<WeatherApiResponse>(url);
    const data = response.data;

    const clima = new Weather();
    clima.city = data.name;
    clima.description = data.weather[0].description;
    clima.temperature = data.main.temp;
    clima.feels_like = data.main.feels_like;
    clima.humidity = data.main.humidity;
    clima.wind_speed = data.wind.speed;
    clima.icon = data.weather[0].icon;
    clima.country = data.sys.country;
    clima.date = new Date().toISOString().split("T")[0];
    clima.user = user;

    await weatherRepo.save(clima);

    res.status(200).json({
      ciudad: clima.city,
      pais: clima.country,
      descripcion: clima.description,
      temperatura: clima.temperature,
      sensacion: clima.feels_like,
      humedad: clima.humidity,
      viento: clima.wind_speed,
      icono: `http://openweathermap.org/img/wn/${clima.icon}@2x.png`,
      fecha: clima.date
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clima", error });
  }
};

export const getUserWeatherHistory = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const history = await weatherRepo.find({
      where: { user: { id: user.id } },
      order: { id: "DESC" }
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error });
  }
};
