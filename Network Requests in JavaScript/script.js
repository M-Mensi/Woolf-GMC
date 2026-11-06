const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const statusMessage = document.querySelector("#status");
const weatherPanel = document.querySelector("#weather-panel");
const submitButton = form.querySelector("button");

const weatherDescriptions = {
  0: ["Clear sky", "☀"],
  1: ["Mostly clear", "🌤"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁"],
  45: ["Foggy", "🌫"],
  48: ["Rime fog", "🌫"],
  51: ["Light drizzle", "🌦"],
  53: ["Drizzle", "🌦"],
  55: ["Heavy drizzle", "🌧"],
  56: ["Freezing drizzle", "🌧"],
  57: ["Heavy freezing drizzle", "🌧"],
  61: ["Light rain", "🌦"],
  63: ["Rain", "🌧"],
  65: ["Heavy rain", "🌧"],
  66: ["Freezing rain", "🌧"],
  67: ["Heavy freezing rain", "🌧"],
  71: ["Light snow", "🌨"],
  73: ["Snow", "🌨"],
  75: ["Heavy snow", "❄"],
  77: ["Snow grains", "❄"],
  80: ["Light showers", "🌦"],
  81: ["Rain showers", "🌧"],
  82: ["Heavy showers", "🌧"],
  85: ["Snow showers", "🌨"],
  86: ["Heavy snow showers", "🌨"],
  95: ["Thunderstorm", "⛈"],
  96: ["Thunderstorm with hail", "⛈"],
  99: ["Heavy thunderstorm with hail", "⛈"],
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  submitButton.disabled = true;
  statusMessage.textContent = "Looking up the weather...";
  weatherPanel.hidden = true;

  try {
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    );
    if (!locationResponse.ok)
      throw new Error("Could not search for that city. Try again.");

    const locationData = await locationResponse.json();
    const location = locationData.results?.[0];
    if (!location)
      throw new Error(
        `No results for “${city}”. Check the spelling and try again.`,
      );

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.search = new URLSearchParams({
      latitude: location.latitude,
      longitude: location.longitude,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
      timezone: "auto",
    });

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok)
      throw new Error("Could not get weather right now. Please try again.");

    const weatherData = await weatherResponse.json();
    showWeather(location, weatherData.current);
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent =
      error.message || "Something went wrong. Please try again.";
  } finally {
    submitButton.disabled = false;
  }
});

function showWeather(location, current) {
  const [description, symbol] = weatherDescriptions[current.weather_code] || [
    "Current conditions",
    "☁",
  ];
  const locationParts = [
    location.name,
    location.admin1,
    location.country,
  ].filter(Boolean);

  document.querySelector("#location-name").textContent = [
    ...new Set(locationParts),
  ].join(", ");
  document.querySelector("#condition").textContent = description;
  document.querySelector("#weather-symbol").textContent = symbol;
  document.querySelector("#temperature").textContent = Math.round(
    current.temperature_2m,
  );
  document.querySelector("#feels-like").textContent = Math.round(
    current.apparent_temperature,
  );
  document.querySelector("#humidity").textContent =
    current.relative_humidity_2m;
  document.querySelector("#wind").textContent = Math.round(
    current.wind_speed_10m,
  );
  document.querySelector("#rain").textContent = Number(
    current.precipitation,
  ).toFixed(1);
  weatherPanel.hidden = false;
}
