import axios from 'axios';

export const getWeatherByCity = async (city: string) => {
  const apiKey = process.env.OPENWEATHER_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const res = await axios.get(url);
  return res.data;
};
