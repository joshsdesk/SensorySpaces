import React from 'react';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function MapComponent({ events, mapRegion, setMapRegion, onCalloutPress }) {
    return (
        <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
        >
            <UrlTile
                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
            />
            {events.map((event) => (
                <Marker
                    key={event.id}
                    coordinate={{
                        latitude: event.coordinates.lat || 40.7128,
                        longitude: event.coordinates.lng || -74.0060
                    }}
                    title={event.title}
                    description={event.location}
                    onCalloutPress={() => onCalloutPress(event)}
                />
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: { width: '100%', flex: 1 },
});
