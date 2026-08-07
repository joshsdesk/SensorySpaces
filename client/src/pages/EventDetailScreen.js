import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchForecast, getWeatherIcon } from '../services/weather';
import AppButton from '../components/ui/AppButton';
import AppCard from '../components/ui/AppCard';
import AppText from '../components/ui/AppText';
import { saveEvent } from '../services/EventStorageService';

export default function EventDetailScreen({ route }) {
    const { event } = route.params;
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        getForecast();
    }, []);

    const getForecast = async () => {
        const isoDate = new Date().toISOString().split('T')[0];
        const data = await fetchForecast(event.coordinates.lat, event.coordinates.lng, isoDate);
        setForecast(data);
    };

    const handleAddToCalendar = async () => {
        try {
            const success = await saveEvent(event);
            if (success) {
                Alert.alert("Success", "Event added to your personal calendar!");
            } else {
                Alert.alert("Notice", "This event is already in your calendar.");
            }
        } catch (error) {
            Alert.alert("Error", "Could not save event. Please try again.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <AppText type="title" style={styles.title}>{event.title}</AppText>
                <AppText type="subheader" style={styles.location}>{event.location}</AppText>
                <AppText type="caption" style={styles.date}>{event.date}</AppText>
            </View>

            <View style={styles.section}>
                <AppText type="header" style={styles.sectionTitle}>Environment Forecast</AppText>
                {forecast ? (
                    <AppCard style={styles.weatherCard}>
                        <View style={styles.weatherRow}>
                            <Ionicons name={getWeatherIcon(forecast.conditionCode)} size={32} color="#5E35B1" />
                            <Text style={styles.tempText}>{forecast.maxTemp}° / {forecast.minTemp}°</Text>
                        </View>
                        <AppText style={styles.precipText}>Rain Chance: {forecast.precipChance}%</AppText>
                        <AppText type="caption" style={styles.weatherDisclaimer}>Forecast for {new Date().toLocaleDateString()}</AppText>
                    </AppCard>
                ) : (
                    <AppText style={styles.loadingText}>Loading environmental data...</AppText>
                )}
            </View>

            <View style={styles.section}>
                <AppText type="header" style={styles.sectionTitle}>Sensory Profile</AppText>
                <View style={styles.tagContainer}>
                    {event.sensory.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <AppText type="tag" style={styles.tagText}>{tag}</AppText>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <AppText type="header" style={styles.sectionTitle}>About this Event</AppText>
                <AppText style={styles.description}>
                    This is a placeholder description. In the real app, this would contain detailed information
                    about the event, venue accessibility features, and specific sensory accommodations provided.
                </AppText>
            </View>

            <View style={styles.actionButton}>
                <AppButton title="Add to Calendar" onPress={handleAddToCalendar} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { padding: 20, backgroundColor: '#F3E5F5', borderBottomWidth: 1, borderBottomColor: '#D1C4E9' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#5E35B1' },
    location: { fontSize: 16, color: '#7E57C2', marginTop: 5 },
    date: { fontSize: 14, color: '#555', marginTop: 5 },
    section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#333' },
    description: { fontSize: 16, lineHeight: 24, color: '#444' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    tag: { backgroundColor: '#D1C4E9', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginBottom: 5 },
    tagText: { color: '#5E35B1', fontWeight: '500' },
    actionButton: { padding: 20 },

    weatherCard: { backgroundColor: '#F0F8FF', padding: 15, borderRadius: 10, alignItems: 'center' },
    weatherRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    tempText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginLeft: 10 },
    precipText: { color: '#666', fontSize: 14 },
    weatherDisclaimer: { fontSize: 12, color: '#999', marginTop: 5 },
    loadingText: { fontStyle: 'italic', color: '#888' }
});
