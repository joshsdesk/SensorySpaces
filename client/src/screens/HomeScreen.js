
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch } from 'react-native';
// import MapView, { Marker } from 'react-native-maps'; // Commented out until configuration is verified
import { useNavigation } from '@react-navigation/native';

// Mock Data for MVP - eventually replace with API call
const MOCK_EVENTS = [
    { id: '1', title: 'Quiet Reading Hour', location: 'City Library', date: '2023-10-27', sensory: ['Quiet', 'Low Light'] },
    { id: '2', title: 'Sensory Friendly Movie', location: 'Metro Cinema', date: '2023-10-28', sensory: ['Audio Compatible', 'Dim Light'] },
    { id: '3', title: 'Calm Park Walk', location: 'Central Park', date: '2023-10-29', sensory: ['Outdoors', 'Crowd Controlled'] },
];

export default function HomeScreen() {
    const navigation = useNavigation();
    const [isMapView, setIsMapView] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Simulate API fetch
        setEvents(MOCK_EVENTS);
    }, []);

    const renderEventItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.location} • {item.date}</Text>
            <View style={styles.tagContainer}>
                {item.sensory.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>{isMapView ? "Map View" : "List View"}</Text>
                <Switch
                    value={isMapView}
                    onValueChange={setIsMapView}
                    trackColor={{ false: "#767577", true: "#80DEEA" }}
                    thumbColor={isMapView ? "#006064" : "#f4f3f4"}
                />
            </View>

            {isMapView ? (
                <View style={styles.mapPlaceholder}>
                    <Text>Map View Placeholder (Configure API Key)</Text>
                    {/* 
            <MapView style={styles.map} initialRegion={{...}}> 
                {events.map(event => <Marker ... />)}
            </MapView> 
            */}
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEventItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    toggleContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10, backgroundColor: '#fff' },
    toggleLabel: { marginRight: 10, fontSize: 16, fontWeight: '600' },
    list: { padding: 10 },
    card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
    tagContainer: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
    tag: { backgroundColor: '#E0F7FA', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginRight: 6, marginTop: 4 },
    tagText: { color: '#006064', fontSize: 12 },
    mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e1e1e1' },
    map: { width: '100%', height: '100%' }
});
