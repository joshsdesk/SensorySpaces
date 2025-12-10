
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.avatarPlaceholder} accessibilityLabel="User Avatar">
                    <Text style={styles.avatarText}>JD</Text>
                </View>
                <Text style={styles.name}>Jane Doe</Text>
                <Text style={styles.subtext}>Sensory Guardian</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.calendarSection}>
                <Text style={styles.sectionTitle}>My Calendar</Text>
                {/* Placeholder for Calendar Component */}
                <View style={styles.calendarPlaceholder}>
                    <Text style={styles.placeholderText}>[Calendar Component Here]</Text>
                    <Text style={styles.placeholderSubtext}>No events saved yet.</Text>
                </View>
            </View>

            <View style={styles.statsSection}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Saved Events</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Connections</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    headerContainer: { alignItems: 'center', padding: 30, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e1e1e1' },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0F7FA', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    avatarText: { fontSize: 36, fontWeight: 'bold', color: '#006064' },
    name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    subtext: { fontSize: 16, color: '#666', marginBottom: 15 },
    editButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#006064' },
    editButtonText: { color: '#006064', fontWeight: 'bold' },
    calendarSection: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    calendarPlaceholder: { height: 150, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
    placeholderText: { fontSize: 16, color: '#999', marginBottom: 5 },
    placeholderSubtext: { fontSize: 14, color: '#bbb' },
    statsSection: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: 'white', marginTop: 10 },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: 22, fontWeight: 'bold', color: '#006064' },
    statLabel: { fontSize: 12, color: '#666', marginTop: 5 }
});
