
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, TouchableOpacity } from 'react-native';

const ONBOARDING_STEPS = [
    {
        title: "Welcome to SensorySpaces",
        description: "Discover sensory-friendly events and places tailored for your family's needs.",
        key: 'welcome'
    },
    {
        title: "Find Your Safe Space",
        description: "Search local events by noise level, lighting, and crowd size.",
        key: 'search'
    },
    {
        title: "Join the Community",
        description: "Connect with other parents and share your experiences safely.",
        key: 'community'
    }
];

export default function OnboardingScreen({ navigation }) {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            navigation.replace('Main'); // Navigate to Main Tab Navigator
        }
    };

    return (
        <SafeAreaView style={styles.container} accessibilityLabel="Onboarding Screen">
            <View style={styles.contentContainer}>
                <Text style={styles.title} accessibilityRole="header">
                    {ONBOARDING_STEPS[step].title}
                </Text>
                <Text style={styles.description}>
                    {ONBOARDING_STEPS[step].description}
                </Text>

                {/* Step Indicators */}
                <View style={styles.indicatorContainer}>
                    {ONBOARDING_STEPS.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.indicator, step === index ? styles.indicatorActive : styles.indicatorInactive]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNext}
                    accessibilityLabel="Next Step Button"
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonText}>
                        {step === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E0F7FA', justifyContent: 'space-between' },
    contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#006064', textAlign: 'center', marginBottom: 20 },
    description: { fontSize: 18, color: '#00838F', textAlign: 'center', lineHeight: 26 },
    indicatorContainer: { flexDirection: 'row', marginTop: 40 },
    indicator: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 5 },
    indicatorActive: { backgroundColor: '#006064' },
    indicatorInactive: { backgroundColor: '#B2EBF2' },
    footer: { padding: 30, width: '100%' },
    button: { backgroundColor: '#006064', paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
