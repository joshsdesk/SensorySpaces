import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_EVENTS_KEY = '@sensory_spaces_saved_events';

/**
 * Saves an event to the local storage.
 * @param {Object} event The event object to save.
 */
export const saveEvent = async (event) => {
    try {
        const savedEventsJson = await AsyncStorage.getItem(SAVED_EVENTS_KEY);
        let savedEvents = savedEventsJson ? JSON.parse(savedEventsJson) : [];

        // Avoid duplicates
        if (!savedEvents.find(e => e.id === event.id)) {
            savedEvents.push(event);
            await AsyncStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEvents));
            return true;
        }
        return false; // Already saved
    } catch (error) {
        console.error('Error saving event:', error);
        throw error;
    }
};

/**
 * Retrieves all saved events from local storage.
 * @returns {Array} List of saved events.
 */
export const getSavedEvents = async () => {
    try {
        const savedEventsJson = await AsyncStorage.getItem(SAVED_EVENTS_KEY);
        return savedEventsJson ? JSON.parse(savedEventsJson) : [];
    } catch (error) {
        console.error('Error retrieving saved events:', error);
        return [];
    }
};

/**
 * Removes an event from local storage.
 * @param {string} eventId The ID of the event to remove.
 */
export const removeEvent = async (eventId) => {
    try {
        const savedEventsJson = await AsyncStorage.getItem(SAVED_EVENTS_KEY);
        if (savedEventsJson) {
            let savedEvents = JSON.parse(savedEventsJson);
            savedEvents = savedEvents.filter(e => e.id !== eventId);
            await AsyncStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEvents));
        }
    } catch (error) {
        console.error('Error removing event:', error);
    }
};
