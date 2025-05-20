import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Weather } from "../models/Weather";
import { User } from "../models/User";
import axios from "axios";

const weatherRepo = AppDataSource.getRepository(Weather);
const userRepo = AppDataSource.getRepository(User);

export const searchAndSaveWeather = async (req: Request, res: Response) => {
  const { city, email } = req.body;

  if (!city || !email) {
    return res.status(400).json({ message: "Ciudad y email son requeridos" });
  }

  try {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const apiKey = "be0d70e3b1dd6929968b214d9c0d7540";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const clima = new Weather();
    clima.city = city;
    clima.description = data.weather[0].description;
    clima.temperature = data.main.temp;
    clima.date = new Date().toISOString().split("T")[0];
    clima.user = user;

    await weatherRepo.save(clima);

    res.status(200).json({
      ciudad: city,
      descripcion: clima.description,
      temperatura: clima.temperature,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clima", error });
  }
};


export const getUserWeatherHistory = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await AppDataSource.getRepository(User).findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const weatherRepo = AppDataSource.getRepository(Weather);
    const history = await weatherRepo.find({
      where: { user: { id: user.id } },
      order: { id: "DESC" }
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error });
  }
};
