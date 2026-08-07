import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../pages/HomeScreen';
import EventDetailScreen from '../pages/EventDetailScreen';
import ProfileScreen from '../pages/ProfileScreen';
import SettingsScreen from '../pages/SettingsScreen';
import AddEventScreen from '../pages/AddEventScreen';
import VerificationScreen from '../pages/VerificationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#F3E5F5' }, headerTintColor: '#5E35B1' }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'SensorySpaces' }} />
            <Stack.Screen name="EventDetails" component={EventDetailScreen} options={{ title: 'Event Details' }} />
            <Stack.Screen
                name="AddEvent"
                component={AddEventScreen}
                options={{
                    title: 'Add Community Event',
                    headerShown: false // We use custom header in AddEventScreen
                }}
            />
            <Stack.Screen
                name="Verification"
                component={VerificationScreen}
                options={{ title: 'Verification Queue', headerShown: false }}
            />
        </Stack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5E35B1',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarLabelStyle: { paddingBottom: 5, fontSize: 12 },
                tabBarStyle: { height: 60, paddingTop: 5 }
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
