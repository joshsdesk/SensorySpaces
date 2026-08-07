import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppText from '../components/ui/AppText';
import { getSavedEvents } from '../services/EventStorageService';
import { getProfile } from '../services/ProfileService';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    const [savedEvents, setSavedEvents] = useState([]);
    const [profile, setProfile] = useState(null);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        const [events, profileData] = await Promise.all([
            getSavedEvents(),
            getProfile()
        ]);
        setSavedEvents(events);
        setProfile(profileData);
    };

    const renderSensoryPreference = (label, value) => (
        <View style={[styles.token, value ? styles.tokenActive : styles.tokenInactive]}>
            <Ionicons
                name={value ? "checkmark-circle" : "close-circle-outline"}
                size={14}
                color={value ? "white" : "#999"}
            />
            <Text style={[styles.tokenText, value && styles.tokenTextActive]}>{label}</Text>
        </View>
    );

    const renderSavedEvent = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.savedEventCard}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
        >
            <View style={styles.eventInfo}>
                <Text style={styles.eventDate}>{item.date}</Text>
                <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#5E35B1" />
        </TouchableOpacity>
    );

    if (!profile) return null;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {profile.name ? profile.name.substring(0, 1).toUpperCase() : 'S'}
                        </Text>
                    </View>
                    <Text style={styles.name}>{profile.name || "Sensory Explorer"}</Text>
                    <Text style={styles.subtext}>{profile.ageGroup || "New User"}</Text>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text style={styles.editButtonText}>Manage Preferences</Text>
                    </TouchableOpacity>
                </View>

                {/* Sensory Profile Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Sensory Needs</Text>
                        <Ionicons name="shield-checkmark" size={20} color="#00796B" />
                    </View>
                    <View style={styles.tokensContainer}>
                        {renderSensoryPreference("Quiet Environment", profile.triggers?.loudNoise)}
                        {renderSensoryPreference("Soft Lighting", profile.triggers?.brightLights)}
                        {renderSensoryPreference("Low Crowds", profile.triggers?.heavyCrowds)}
                        {renderSensoryPreference("Scent Free", profile.triggers?.strongScents)}
                    </View>
                </View>

                {/* Interests Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Interests</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.interestRow}>
                        {Object.entries(profile.interests || {}).map(([key, value]) => value && (
                            <View key={key} style={styles.interestChip}>
                                <Text style={styles.interestChipText}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.calendarSection}>
                    <Text style={styles.sectionTitle}>Saved for Later</Text>
                    {savedEvents.length > 0 ? (
                        savedEvents.map(event => renderSavedEvent(event))
                    ) : (
                        <View style={styles.calendarPlaceholder}>
                            <Ionicons name="bookmark-outline" size={48} color="#D1C4E9" />
                            <Text style={styles.placeholderText}>No saved events yet</Text>
                            <Text style={styles.placeholderSubtext}>Bookmark events to see them here.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    headerContainer: { alignItems: 'center', padding: 30, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#5E35B1' },
    name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    subtext: { fontSize: 16, color: '#666', marginBottom: 15 },
    editButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#F3E5F5' },
    editButtonText: { color: '#5E35B1', fontWeight: 'bold', fontSize: 14 },

    section: { padding: 20, backgroundColor: 'white', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

    tokensContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    token: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1 },
    tokenActive: { backgroundColor: '#00796B', borderColor: '#00796B' },
    tokenInactive: { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },
    tokenText: { fontSize: 13, marginLeft: 5, color: '#999', fontWeight: '600' },
    tokenTextActive: { color: 'white' },

    interestRow: { flexDirection: 'row', paddingVertical: 5 },
    interestChip: { backgroundColor: '#E1F5FE', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
    interestChipText: { color: '#0288D1', fontWeight: 'bold', fontSize: 13 },

    calendarSection: { padding: 20 },
    calendarPlaceholder: { height: 180, backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1C4E9' },
    placeholderText: { fontSize: 16, color: '#999', marginTop: 10, fontWeight: '600' },
    placeholderSubtext: { fontSize: 14, color: '#bbb', marginTop: 5 },

    savedEventCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        elevation: 1,
    },
    eventInfo: { flex: 1 },
    eventDate: { fontSize: 12, color: '#7E57C2', fontWeight: 'bold', marginBottom: 2 },
    eventTitle: { fontSize: 16, color: '#333', fontWeight: '600' },
});
