
/**
 * SensortWeatherBridge.js
 * Maps real-time weather data to potential sensory impacts for events.
 * This creates the "Smart Aura" overlay in the UI.
 */

export const getSensoryAura = (weather, event) => {
    if (!weather) return null;

    const code = weather.conditionCode;
    const auras = [];

    // 1. Noise Impacts
    if (code >= 95 && code <= 99) {
        auras.push({
            type: 'noise',
            level: 'high',
            label: 'Thunder Warning',
            description: 'Sudden loud noises likely due to thunderstorms.',
            icon: 'thunderstorm'
        });
    } else if (code >= 51 && code <= 82) {
        auras.push({
            type: 'noise',
            level: 'low',
            label: 'Rain Patter',
            description: 'Ambient drumming noise from rain on roof/pavement.',
            icon: 'rainy'
        });
    }

    // 2. Lighting Impacts
    if (code === 0) {
        auras.push({
            type: 'lighting',
            level: 'bright',
            label: 'Harsh Light',
            description: 'High contrast and glare expected today.',
            icon: 'sunny'
        });
    } else if (code >= 45 && code <= 48) {
        auras.push({
            type: 'lighting',
            level: 'dim',
            label: 'Natural Dim',
            description: 'Soft, overcast lighting today.',
            icon: 'cloudy'
        });
    }

    // 3. Temperature/Comfort Impacts
    if (weather.temp > 90) {
        auras.push({
            type: 'comfort',
            level: 'alert',
            label: 'Heat Alert',
            description: 'High temps may increase irritability and crowd density.',
            icon: 'thermometer'
        });
    } else if (weather.temp < 32) {
        auras.push({
            type: 'comfort',
            level: 'alert',
            label: 'Cold Alert',
            description: 'Extreme cold may affect outdoor transition times.',
            icon: 'snow'
        });
    }

    // Return the most relevant aura (Priority: Thunder > Heat > Rain > Harsh Light)
    // For now, we return the first one found or null
    return auras.length > 0 ? auras[0] : null;
};
