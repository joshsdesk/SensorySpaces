import axios from 'axios';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchCurrentWeather = async (lat, lon) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                latitude: lat,
                longitude: lon,
                current: 'temperature_2m,weather_code',
                temperature_unit: 'fahrenheit',
                timezone: 'auto'
            }
        });

        if (response.data && response.data.current) {
            return {
                temp: Math.round(response.data.current.temperature_2m),
                conditionCode: response.data.current.weather_code
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null;
    }
};

export const fetchForecast = async (lat, lon, date) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                latitude: lat,
                longitude: lon,
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                temperature_unit: 'fahrenheit',
                timezone: 'auto',
                start_date: date,
                end_date: date
            }
        });

        if (response.data && response.data.daily) {
            return {
                maxTemp: Math.round(response.data.daily.temperature_2m_max[0]),
                minTemp: Math.round(response.data.daily.temperature_2m_min[0]),
                conditionCode: response.data.daily.weather_code[0],
                precipChance: response.data.daily.precipitation_probability_max[0]
            };
        }
        return null;
    } catch (error) {
        // OpenMeteo strictly limits how far back/forward you can query. 
        // Silent failure is acceptable here as it's an enhancement.
        console.log("Forecast likely out of range or error:", error.message);
        return null;
    }
};

// WMO Weather interpretation codes (simplified)
export const getWeatherIcon = (code) => {
    if (code === 0) return 'sunny';
    if (code >= 1 && code <= 3) return 'partly-sunny';
    if (code >= 45 && code <= 48) return 'cloudy';
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rainy';
    if (code >= 95 && code <= 99) return 'thunderstorm';
    return 'cloud-outline'; // Default
};
