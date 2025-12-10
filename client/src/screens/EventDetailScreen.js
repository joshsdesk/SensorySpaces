
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';

export default function EventDetailScreen({ route }) {
    const { event } = route.params;

    const handleAddToCalendar = () => {
        Alert.alert("Success", "Event added to your personal calendar!");
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.location}>{event.location}</Text>
                <Text style={styles.date}>{event.date}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sensory Profile</Text>
                <View style={styles.tagContainer}>
                    {event.sensory.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About this Event</Text>
                <Text style={styles.description}>
                    This is a placeholder description. In the real app, this would contain detailed information
                    about the event, venue accessibility features, and specific sensory accommodations provided.
                </Text>
            </View>

            <View style={styles.actionButton}>
                <Button title="Add to Calendar" onPress={handleAddToCalendar} color="#00838F" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { padding: 20, backgroundColor: '#E0F7FA', borderBottomWidth: 1, borderBottomColor: '#B2EBF2' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#006064' },
    location: { fontSize: 16, color: '#00838F', marginTop: 5 },
    date: { fontSize: 14, color: '#555', marginTop: 5 },
    section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#333' },
    description: { fontSize: 16, lineHeight: 24, color: '#444' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    tag: { backgroundColor: '#B2EBF2', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginBottom: 5 },
    tagText: { color: '#006064', fontWeight: '500' },
    actionButton: { padding: 20 }
});
