import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'user_profile_v1';

let currentProfile = null;

export const saveProfile = async (profile) => {
    console.log("[ProfileService] Saving profile:", profile);
    try {
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        currentProfile = profile;
        return true;
    } catch (error) {
        console.error("[ProfileService] Save error:", error);
        return false;
    }
};

export const getProfile = async () => {
    if (currentProfile) return currentProfile;

    try {
        const data = await AsyncStorage.getItem(PROFILE_KEY);
        if (data) {
            currentProfile = JSON.parse(data);
            return currentProfile;
        }
    } catch (error) {
        console.error("[ProfileService] Get error:", error);
    }

    // Default Fallback
    return {
        name: '',
        ageGroup: '',
        triggers: {
            loudNoise: false,
            brightLights: false,
            heavyCrowds: false,
            strongScents: false
        },
        interests: {
            animals: false,
            nature: false,
            music: false,
            art: false,
            dinosaurs: false
        },
        otherInterests: ''
    };
};

export const clearProfile = async () => {
    try {
        await AsyncStorage.removeItem(PROFILE_KEY);
        currentProfile = null;
        return true;
    } catch (error) {
        return false;
    }
};
