import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const TIPS = [
    {
        title: "Welcome to SensorySpaces",
        description: "Discover sensory-friendly events and places tailored for your family's needs.",
        icon: "heart-outline"
    },
    {
        title: "Find Your Safe Space",
        description: "Search local events by noise level, lighting, and crowd size.",
        icon: "search-outline"
    },
    {
        title: "Join the Community",
        description: "Connect with other parents and share your experiences safely.",
        icon: "people-outline"
    }
];

export default function TipsModal({ visible, onClose }) {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < TIPS.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    if (!visible) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint="dark" style={styles.absolute}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        <View style={styles.content}>
                            <Ionicons name={TIPS[step].icon} size={64} color="#5E35B1" style={{ marginBottom: 20 }} />
                            <Text style={styles.title}>{TIPS[step].title}</Text>
                            <Text style={styles.description}>{TIPS[step].description}</Text>
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.indicators}>
                                {TIPS.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[styles.indicator, step === index ? styles.indicatorActive : styles.indicatorInactive]}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleNext}>
                                <Text style={styles.buttonText}>
                                    {step === TIPS.length - 1 ? "Get Started" : "Next"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)' // Slight dark overlay on top of blur
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 5
    },
    content: {
        alignItems: 'center',
        marginVertical: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5E35B1',
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24
    },
    footer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center'
    },
    indicators: {
        flexDirection: 'row',
        marginBottom: 20
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4
    },
    indicatorActive: { backgroundColor: '#5E35B1' },
    indicatorInactive: { backgroundColor: '#E0E0E0' },
    button: {
        backgroundColor: '#5E35B1',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
