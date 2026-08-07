import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapComponent() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map View not available on Web</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
    text: { color: '#666', fontSize: 16 }
});
