const axios = require('axios');

const API_URL = 'http://localhost:5000/api/events';

async function testSearch() {
    console.log("--- Testing SensorySpaces Search API ---");

    try {
        // 1. Test basic search
        console.log("\n1. Testing basic keyword search (q='museum'):");
        const res1 = await axios.get(`${API_URL}?q=museum`);
        console.log(`Results found: ${res1.data.length}`);
        if (res1.data.length > 0) {
            console.log(`First result: ${res1.data[0].title}`);
        }

        // 2. Test geospatial search (Near Herald Square)
        console.log("\n2. Testing geospatial search (Near Herald Square, NYC):");
        const res2 = await axios.get(`${API_URL}?lat=40.7484&lng=-73.9857&radius=5`);
        console.log(`Results found within 5km: ${res2.data.length}`);

        // 3. Test personalized search (Loud Noise trigger)
        console.log("\n3. Testing personalized search (Avoid Loud Noise -> lowNoise=true):");
        const res3 = await axios.get(`${API_URL}?lowNoise=true`);
        console.log(`Results found: ${res3.data.length}`);
        if (res3.data.length > 0) {
            console.log(`Sensory tags in first result: ${res3.data[0].sensoryTags.join(', ')}`);
        }

        console.log("\n--- Verification Complete ---");
    } catch (error) {
        console.error("Verification failed:", error.message);
    }
}

testSearch();
