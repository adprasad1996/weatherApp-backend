const axios = require("axios");
const WeatherModel = require("../models/WeatherModel");

const getWeather = async (req, res) => {
  const { city } = req.params;

  try {
    const cachedWeather = await WeatherModel.findOne({ city });

    if (cachedWeather && isDataValid(cachedWeather.timestamp)) {
      console.log("received from db")
      return res.json(cachedWeather.data);
    }

    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
    );

    const weatherData = response.data;
    await WeatherModel.findOneAndUpdate(
      { city },
      { city, data: weatherData, timestamp: new Date() },
      { upsert: true }
    );

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather data", error });
  }
  
};

const isDataValid = (timestamp) => {
  const oneHour = 60 * 60 * 1000;
  return new Date() - new Date(timestamp) < oneHour;
};

module.exports = { getWeather };
