
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import API from '../config/api';
import axios from 'axios';

const API_URL = API.events;

const SENSORY_LEVELS = ['Quiet', 'Moderate', 'Lively'];
const LIGHTING_LEVELS = ['Dim', 'Natural', 'Bright'];
const CROWD_LEVELS = ['Small', 'Medium', 'Large'];

export default function AddEventScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        address: '',
        noiseLevel: 'Moderate',
        lighting: 'Natural',
        crowdDensity: 'Medium'
    });

    const handleSubmit = async () => {
        if (!formData.title || !formData.address) {
            Alert.alert("Missing Info", "Please provide at least a title and location.");
            return;
        }

        setLoading(true);
        try {
            const eventPayload = {
                title: formData.title,
                description: formData.description,
                date: new Date(formData.date).toISOString(),
                location: {
                    address: formData.address,
                    geo: { type: 'Point', coordinates: [-104.9903, 39.7392] } // Default Denver for demo
                },
                sensoryProfile: {
                    noiseLevel: { value: formData.noiseLevel, confidence: 1, source: 'user' },
                    lighting: { value: formData.lighting, confidence: 1, source: 'user' },
                    crowdDensity: { value: formData.crowdDensity, confidence: 1, source: 'user' }
                }
            };

            await axios.post(API_URL, eventPayload);
            Alert.alert("Success", "Event submitted for community verification!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Submission error:", error);
            Alert.alert("Error", "Could not save event. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const Selector = ({ label, options, current, onSelect }) => (
        <View style={styles.selectorContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.chipRow}>
                {options.map(opt => (
                    <TouchableOpacity
                        key={opt}
                        style={[styles.chip, current === opt && styles.chipActive]}
                        onPress={() => onSelect(opt)}
                    >
                        <Text style={[styles.chipText, current === opt && styles.chipTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color="#5E35B1" />
                </TouchableOpacity>
                <AppText type="header" style={styles.headerTitle}>Add Community Event</AppText>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Event Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Sensory Friendly Storytime"
                    value={formData.title}
                    onChangeText={(val) => setFormData({ ...formData, title: val })}
                />

                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell us what makes it sensory friendly..."
                    multiline
                    numberOfLines={4}
                    value={formData.description}
                    onChangeText={(val) => setFormData({ ...formData, description: val })}
                />

                <Text style={styles.label}>Location Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Street, City, State"
                    value={formData.address}
                    onChangeText={(val) => setFormData({ ...formData, address: val })}
                />

                <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="2026-01-22"
                    value={formData.date}
                    onChangeText={(val) => setFormData({ ...formData, date: val })}
                />
            </View>

            <View style={styles.section}>
                <AppText type="subheader" style={styles.sensoryHeader}>Sensory Profile</AppText>
                <Selector
                    label="Noise Level"
                    options={SENSORY_LEVELS}
                    current={formData.noiseLevel}
                    onSelect={(val) => setFormData({ ...formData, noiseLevel: val })}
                />
                <Selector
                    label="Lighting"
                    options={LIGHTING_LEVELS}
                    current={formData.lighting}
                    onSelect={(val) => setFormData({ ...formData, lighting: val })}
                />
                <Selector
                    label="Expected Crowds"
                    options={CROWD_LEVELS}
                    current={formData.crowdDensity}
                    onSelect={(val) => setFormData({ ...formData, crowdDensity: val })}
                />
            </View>

            <AppButton
                title="Share with the Community"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitBtn}
            />
            <Text style={styles.disclaimer}>
                By submitting, you help other families find safe spaces. Community events are verified periodically.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    content: { paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 20 },
    section: { padding: 20 },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
        marginTop: 15
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#F9F9F9'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    sensoryHeader: {
        marginBottom: 10,
        color: '#5E35B1'
    },
    selectorContainer: { marginBottom: 15 },
    chipRow: { flexDirection: 'row', marginTop: 5 },
    chip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    chipActive: {
        backgroundColor: '#F3E5F5',
        borderColor: '#5E35B1'
    },
    chipText: { color: '#666', fontSize: 13, fontWeight: '600' },
    chipTextActive: { color: '#5E35B1' },
    submitBtn: { marginHorizontal: 20, marginTop: 10 },
    disclaimer: {
        paddingHorizontal: 30,
        marginTop: 15,
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        lineHeight: 18
    }
});
