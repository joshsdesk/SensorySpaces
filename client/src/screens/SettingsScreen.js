
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
    const [largeText, setLargeText] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [locationServices, setLocationServices] = useState(true);

    const renderToggle = (label, value, onValueChange) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: "#767577", true: "#80DEEA" }}
                thumbColor={value ? "#006064" : "#f4f3f4"}
                accessibilityLabel={`Toggle ${label}`}
            />
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Accessibility</Text>
            <View style={styles.section}>
                {renderToggle("Large Text", largeText, setLargeText)}
                {renderToggle("High Contrast Mode", highContrast, setHighContrast)}
            </View>

            <Text style={styles.header}>Preferences</Text>
            <View style={styles.section}>
                {renderToggle("Push Notifications", notifications, setNotifications)}
                {renderToggle("Location Services", locationServices, setLocationServices)}
            </View>

            <Text style={styles.header}>Account</Text>
            <View style={styles.section}>
                <TouchableOpacity style={styles.buttonRow}>
                    <Text style={styles.buttonLabel}>Edit Profile</Text>
                    <Text style={styles.chevron}>{">"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRow}>
                    <Text style={styles.buttonLabel}>Manage Child Profiles</Text>
                    <Text style={styles.chevron}>{">"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRow}>
                    <Text style={[styles.buttonLabel, styles.logoutText]}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.version}>Version 1.0.0 (Alpha)</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { fontSize: 14, fontWeight: 'bold', color: '#666', marginTop: 25, marginBottom: 10, marginLeft: 20, textTransform: 'uppercase' },
    section: { backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e1e1e1' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    label: { fontSize: 16, color: '#333' },
    buttonLabel: { fontSize: 16, color: '#006064' },
    logoutText: { color: '#D32F2F' },
    chevron: { color: '#ccc', fontSize: 18 },
    version: { textAlign: 'center', color: '#999', marginVertical: 30 }
});
