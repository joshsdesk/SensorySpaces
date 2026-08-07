import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapComponent from '../components/MapComponent';
import TipsModal from '../components/ui/TipsModal';
import AppCard from '../components/ui/AppCard';
import AppText from '../components/ui/AppText';
import OnboardingModal from '../components/ui/OnboardingModal';
import { fetchCurrentWeather, getWeatherIcon } from '../services/weather';
import { getProfile } from '../services/ProfileService';
import { saveEvent } from '../services/EventStorageService';
import { getSensoryAura } from '../utils/sensoryWeatherBridge';
import API from '../config/api';
import axios from 'axios';

const API_URL = API.events;

const FILTERS = ["All", "Sensory Hours", "Quiet Zones", "Low Crowds", "ASD Friendly", "Free"];

export default function HomeScreen() {
    const navigation = useNavigation();
    const [isMapView, setIsMapView] = useState(false);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState("All");
    const [showTips, setShowTips] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [weather, setWeather] = useState(null);
    const [profile, setProfile] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });

    useEffect(() => {
        fetchEvents();
        updateWeather(mapRegion.latitude, mapRegion.longitude);
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const data = await getProfile();
        setProfile(data);
    };

    const updateWeather = async (lat, lon) => {
        try {
            const data = await fetchCurrentWeather(lat, lon);
            setWeather(data);
        } catch (e) {
            console.log("Weather error", e);
        }
    };

    const fetchEvents = async (searchParams = {}) => {
        try {
            // console.log("Fetching events from:", API_URL, searchParams);
            const response = await axios.get(API_URL, { params: searchParams });
            // console.log("Events fetched:", response.data.length);

            const mappedEvents = response.data.map(e => {
                // Handle both new Layer A/B schema and potential legacy data
                const meta = e.metadata || {};
                const sensory = e.sensoryProfile || {};
                const location = meta.location || {};

                // Flatten Sensory Profile into display tags
                // e.g., { noiseLevel: { value: 'Low' } } -> "Noise: Low"
                const displayTags = [];
                if (sensory.noiseLevel?.value) displayTags.push(`Noise: ${sensory.noiseLevel.value}`);
                if (sensory.lighting?.value) displayTags.push(`Light: ${sensory.lighting.value}`);
                if (sensory.crowdDensity?.value) displayTags.push(`Crowds: ${sensory.crowdDensity.value}`);

                // Add specific details/amenities
                if (sensory.details && Array.isArray(sensory.details)) {
                    sensory.details.forEach(d => displayTags.push(d.value));
                }

                // Fallback to legacy structure if metadata is missing (safety)
                const title = meta.title || e.title || 'Untitled Event';
                const addr = location.address || e.location?.address || 'Unknown Location';
                const dateRaw = meta.date || e.date;
                const coords = location.geo?.coordinates || e.location?.geo?.coordinates;

                return {
                    id: e._id,
                    title: title,
                    location: addr,
                    date: new Date(dateRaw).toLocaleDateString(),
                    sensory: displayTags.length > 0 ? displayTags : (e.sensoryTags || []),
                    description: meta.description || e.description,
                    coordinates: coords ? {
                        lng: coords[0],
                        lat: coords[1]
                    } : { lat: 39.7392, lng: -104.9903 } // Denver default
                };
            });
            setEvents(mappedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleSearch = async () => {
        console.log("Identifying search with query:", searchQuery);
        const params = {
            q: searchQuery,
            lat: mapRegion.latitude,
            lng: mapRegion.longitude,
            lowNoise: profile?.triggers?.loudNoise,
            dimmedLights: profile?.triggers?.brightLights,
            smallCrowds: profile?.triggers?.heavyCrowds,
            interests: profile?.otherInterests
        };
        fetchEvents(params);
    };

    const handleSaveEvent = async (event) => {
        try {
            const success = await saveEvent(event);
            if (success) {
                Alert.alert("Saved", `${event.title} added to your profile!`);
            } else {
                Alert.alert("Notice", "Already saved.");
            }
        } catch (error) {
            Alert.alert("Error", "Could not save event.");
        }
    };

    const renderEventItem = ({ item }) => {
        const aura = getSensoryAura(weather, item);

        return (
            <AppCard
                onPress={() => navigation.navigate('EventDetails', { event: item })}
                accessibilityLabel={`Event: ${item.title}`}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.titleWrapper}>
                        <AppText type="subheader" style={styles.title}>{item.title}</AppText>
                        {aura && (
                            <View style={[styles.auraBadge, styles[`aura_${aura.type}`]]}>
                                <Ionicons name={aura.icon} size={10} color="white" />
                                <Text style={styles.auraText}>{aura.label}</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => handleSaveEvent(item)}>
                        <Ionicons name="bookmark-outline" size={24} color="#5E35B1" />
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <AppText type="caption" style={styles.subtitle}> {item.location}</AppText>
                </View>
                <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <AppText type="caption" style={styles.subtitle}> {item.date}</AppText>
                </View>

                <View style={styles.tagContainer}>
                    {item.sensory.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <AppText type="tag" style={styles.tagText}>{tag}</AppText>
                        </View>
                    ))}
                </View>
            </AppCard>
        );
    };

    return (
        <View style={styles.container}>
            <OnboardingModal visible={showOnboarding} onClose={() => setShowOnboarding(false)} />
            <TipsModal visible={showTips} onClose={() => setShowTips(false)} />

            {/* Google-like Search Bar */}
            <View style={styles.googleSearchWrapper}>
                <View style={styles.googleSearchContainer}>
                    <TouchableOpacity onPress={handleSearch} accessibilityLabel="Search">
                        <Ionicons name="search" size={20} color="#5E35B1" style={styles.searchIcon} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={profile?.name ? `Searching for ${profile.name}...` : "Search events, places..."}
                        placeholderTextColor="#78909C"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    {weather && (
                        <TouchableOpacity style={styles.weatherInfo}>
                            <Ionicons name={getWeatherIcon(weather.conditionCode)} size={20} color="#5E35B1" />
                            <Text style={styles.weatherText}>{weather.temp}°</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {profile?.name && (
                    <Text style={styles.personalizedLabel}>✨ Tailored for {profile.name}'s needs</Text>
                )}
            </View>

            {/* Filter Chips */}
            <View style={styles.filterRow}>
                <View style={styles.filterContainer}>
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.chip, activeFilter === filter && styles.chipActive]}
                            onPress={() => setActiveFilter(filter)}
                            accessibilityLabel={`Filter by ${filter}`}
                        >
                            <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* View Toggle */}
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Showing {events.length} Results</Text>
                <View style={styles.switchWrapper}>
                    <Text style={styles.switchText}>{isMapView ? "Map" : "List"}</Text>
                    <Switch
                        value={isMapView}
                        onValueChange={setIsMapView}
                        trackColor={{ false: "#767577", true: "#80DEEA" }}
                        thumbColor={isMapView ? "#5E35B1" : "#f4f3f4"}
                        accessibilityLabel="Toggle Map View"
                    />
                </View>
            </View>

            {/* Main Content */}
            {isMapView ? (
                <MapComponent
                    events={events}
                    mapRegion={mapRegion}
                    setMapRegion={setMapRegion}
                    onCalloutPress={(item) => navigation.navigate('EventDetails', { event: item })}
                />
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEventItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No events found.</Text>
                        </View>
                    }
                />
            )}

            {/* Floating Action Button (Add Event) */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddEvent')}
                accessibilityLabel="Add Community Event"
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    googleSearchWrapper: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    googleSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        paddingHorizontal: 15,
        height: 54,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: '#E0F2F1',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#263238', fontWeight: '500' },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#eee',
        paddingLeft: 10,
    },
    weatherText: {
        color: '#5E35B1',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 14
    },
    personalizedLabel: {
        fontSize: 12,
        color: '#00796B',
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '600',
    },

    filterRow: { backgroundColor: 'white', paddingVertical: 10 },
    filterContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: 10, marginBottom: 10 },
    chipActive: { backgroundColor: '#5E35B1' },
    chipText: { color: '#666', fontWeight: '500' },
    chipTextActive: { color: 'white' },

    toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
    toggleLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
    switchWrapper: { flexDirection: 'row', alignItems: 'center' },
    switchText: { marginRight: 10, fontSize: 14, color: '#333' },

    list: { paddingHorizontal: 15 },
    card: { backgroundColor: 'white', padding: 15, marginBottom: 15, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    subtitle: { fontSize: 14, color: '#666' },

    tagContainer: { flexDirection: 'row', marginTop: 12, flexWrap: 'wrap' },
    tag: { backgroundColor: '#D1C4E9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginTop: 4 },
    tagText: { color: '#5E35B1', fontSize: 12, fontWeight: '600' },

    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#888', fontSize: 16 },

    weatherBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginHorizontal: 8
    },
    weatherText: {
        color: '#5E35B1',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 14
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#5E35B1',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    }
});
