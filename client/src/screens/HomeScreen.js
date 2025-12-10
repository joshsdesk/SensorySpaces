
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MOCK_EVENTS = [
    { id: '1', title: 'Quiet Reading Hour', location: 'City Library', date: '2023-10-27', sensory: ['Quiet', 'Low Light'] },
    { id: '2', title: 'Sensory Friendly Movie', location: 'Metro Cinema', date: '2023-10-28', sensory: ['Audio Compatible', 'Dim Light'] },
    { id: '3', title: 'Calm Park Walk', location: 'Central Park', date: '2023-10-29', sensory: ['Outdoors', 'Crowd Controlled'] },
    { id: '4', title: 'Autism-Friendly Museum Tour', location: 'History Museum', date: '2023-10-30', sensory: ['Wheelchair Accessible', 'Interactive'] },
];

const FILTERS = ["All", "Quiet", "Outdoors", "Arts", "Sports", "Free"];

export default function HomeScreen() {
    const navigation = useNavigation();
    const [isMapView, setIsMapView] = useState(false);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        setEvents(MOCK_EVENTS);
    }, []);

    const renderEventItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
            accessibilityLabel={`Event: ${item.title}`}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <Ionicons name="bookmark-outline" size={24} color="#006064" />
            </View>
            <View style={styles.row}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.subtitle}> {item.location}</Text>
            </View>
            <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.subtitle}> {item.date}</Text>
            </View>

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
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search events, places..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    accessibilityLabel="Search Events"
                />
                <TouchableOpacity style={styles.filterButton} accessibilityLabel="Filter Options">
                    <Ionicons name="options-outline" size={24} color="#006064" />
                </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
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
                </ScrollView>
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
                        thumbColor={isMapView ? "#006064" : "#f4f3f4"}
                        accessibilityLabel="Toggle Map View"
                    />
                </View>
            </View>

            {/* Main Content */}
            {isMapView ? (
                <View style={styles.mapPlaceholder}>
                    <Ionicons name="map" size={64} color="#ccc" />
                    <Text style={styles.placeholderText}>Interactive Map Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEventItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#333' },
    filterButton: { marginLeft: 10, padding: 5 },

    filterRow: { height: 60, backgroundColor: 'white' },
    filterScroll: { paddingHorizontal: 15, alignItems: 'center' },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: 10 },
    chipActive: { backgroundColor: '#006064' },
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
    tag: { backgroundColor: '#E0F7FA', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginTop: 4 },
    tagText: { color: '#006064', fontSize: 12, fontWeight: '600' },

    mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e1e1e1', margin: 15, borderRadius: 12 },
    placeholderText: { marginTop: 10, color: '#666' }
});
