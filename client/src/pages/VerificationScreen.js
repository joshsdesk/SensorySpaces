
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/ui/AppText';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import API from '../config/api';
import axios from 'axios';

const API_URL = API.events;

export default function VerificationScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUnverified();
    }, []);

    const fetchUnverified = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/unverified`);
            setEvents(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
            Alert.alert("Error", "Could not load unverified events.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (eventId) => {
        try {
            await axios.patch(`${API_URL}/${eventId}/verify`);
            setEvents(events.filter(e => e._id !== eventId));
            Alert.alert("Success", "Event verified and promoted to Community status.");
        } catch (error) {
            Alert.alert("Error", "Could not verify event.");
        }
    };

    const renderEventItem = ({ item }) => (
        <AppCard style={styles.card}>
            <View style={styles.cardHeader}>
                <AppText type="subheader" style={styles.title}>{item.metadata.title}</AppText>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.metadata.source}</Text>
                </View>
            </View>
            <AppText type="caption" style={styles.location}>{item.metadata.location?.address}</AppText>

            <View style={styles.sensoryRow}>
                <View style={styles.sensoryBox}>
                    <Text style={styles.sensoryLabel}>Noise</Text>
                    <Text style={styles.sensoryValue}>{item.sensoryProfile.noiseLevel?.value}</Text>
                </View>
                <View style={styles.sensoryBox}>
                    <Text style={styles.sensoryLabel}>Light</Text>
                    <Text style={styles.sensoryValue}>{item.sensoryProfile.lighting?.value}</Text>
                </View>
                <View style={styles.sensoryBox}>
                    <Text style={styles.sensoryLabel}>Crowd</Text>
                    <Text style={styles.sensoryValue}>{item.sensoryProfile.crowdDensity?.value}</Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <AppButton
                    title="Verify"
                    onPress={() => handleVerify(item._id)}
                    style={styles.verifyBtn}
                />
                <TouchableOpacity style={styles.ignoreBtn}>
                    <Text style={styles.ignoreText}>Ignore</Text>
                </TouchableOpacity>
            </View>
        </AppCard>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#5E35B1" />
                </TouchableOpacity>
                <AppText type="header" style={styles.headerTitle}>Verification Queue</AppText>
                <TouchableOpacity onPress={fetchUnverified}>
                    <Ionicons name="refresh" size={24} color="#5E35B1" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#5E35B1" />
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item._id}
                    renderItem={renderEventItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="checkmark-done-circle-outline" size={64} color="#D1C4E9" />
                            <Text style={styles.emptyText}>Queue Clear!</Text>
                            <Text style={styles.emptySubtext}>All user submissions have been reviewed.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: { fontSize: 20 },
    list: { padding: 15 },
    card: { marginBottom: 15, padding: 15 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 18, color: '#333', flex: 1 },
    tag: { backgroundColor: '#F3E5F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    tagText: { fontSize: 10, color: '#5E35B1', fontWeight: 'bold' },
    location: { marginTop: 4, color: '#666' },
    sensoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, padding: 10, backgroundColor: '#F9F9F9', borderRadius: 8 },
    sensoryBox: { alignItems: 'center', flex: 1 },
    sensoryLabel: { fontSize: 10, color: '#999', textTransform: 'uppercase' },
    sensoryValue: { fontSize: 14, color: '#333', fontWeight: 'bold', marginTop: 2 },
    actionRow: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
    verifyBtn: { flex: 1, height: 44 },
    ignoreBtn: { marginLeft: 20 },
    ignoreText: { color: '#E53935', fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 20, fontWeight: 'bold', color: '#5E35B1', marginTop: 15 },
    emptySubtext: { color: '#999', marginTop: 5 }
});
