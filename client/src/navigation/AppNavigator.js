
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import EventDetailScreen from '../screens/EventDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: { backgroundColor: '#E0F7FA' }, // Sensory friendly soft blue
                    headerTintColor: '#006064',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SensorySpaces' }} />
                <Stack.Screen name="EventDetails" component={EventDetailScreen} options={{ title: 'Event Details' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
