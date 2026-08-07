import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, TextInput, ScrollView, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import AppButton from './AppButton';
import { saveProfile } from '../../services/ProfileService';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
    {
        icon: "heart",
        color: "#E91E63",
        title: "Welcome to SensorySpaces",
        description: "Discover sensory-friendly events and places tailored for your family's needs.",
    },
    {
        icon: "search",
        color: "#2196F3",
        title: "Find Your Safe Space",
        description: "Search local events by noise level, lighting, and crowd size.",
    },
    {
        icon: "people",
        color: "#4CAF50",
        title: "Join the Community",
        description: "Connect with other parents and share your experiences safely.",
    },
    {
        icon: "happy",
        color: "#FF9800",
        title: "Tell us about your kiddo",
        description: "Help us find the perfect spots by sharing a bit about their needs.",
        isProfileStep: true
    }
];

export default function OnboardingModal({ visible, onClose }) {
    const [step, setStep] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [profile, setProfile] = useState({
        name: '',
        ageGroup: '',
        triggers: {
            loudNoise: false,
            brightLights: false,
            heavyCrowds: false,
            strongScents: false
        },
        interests: {
            animals: false,
            nature: false,
            music: false,
            art: false,
            dinosaurs: false
        },
        otherInterests: ''
    });

    useEffect(() => {
        if (visible) {
            triggerAnimation();
        }
    }, [step, visible]);

    const triggerAnimation = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
        scaleAnim.setValue(0.8);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    };

    const toggleTrigger = (trigger) => {
        setProfile(prev => ({
            ...prev,
            triggers: { ...prev.triggers, [trigger]: !prev.triggers[trigger] }
        }));
    };

    const toggleInterest = (interest) => {
        setProfile(prev => ({
            ...prev,
            interests: { ...prev.interests, [interest]: !prev.interests[interest] }
        }));
    };

    const handleNext = async () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            await saveProfile(profile);
            onClose();
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

                <View style={styles.modalView}>
                    <Animated.View style={[
                        styles.iconContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                            backgroundColor: ONBOARDING_STEPS[step].color + '20'
                        }
                    ]}>
                        <Ionicons name={ONBOARDING_STEPS[step].icon} size={60} color={ONBOARDING_STEPS[step].color} />
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%', alignItems: 'center' }}>
                        <AppText type="header" style={[styles.title, { color: ONBOARDING_STEPS[step].color }]}>
                            {ONBOARDING_STEPS[step].title}
                        </AppText>

                        <AppText style={styles.description}>
                            {ONBOARDING_STEPS[step].description}
                        </AppText>
                    </Animated.View>

                    {ONBOARDING_STEPS[step].isProfileStep && (
                        <View style={styles.profileForm}>
                            <TextInput
                                style={styles.input}
                                placeholder="Kiddo's Name (optional)"
                                value={profile.name}
                                onChangeText={(text) => setProfile({ ...profile, name: text })}
                            />

                            <AppText type="subheader" style={styles.formLabel}>Sensory Triggers to Avoid</AppText>
                            <View style={styles.needsContainer}>
                                <TouchableOpacity
                                    style={[styles.needChip, profile.triggers.loudNoise && styles.needChipActive]}
                                    onPress={() => toggleTrigger('loudNoise')}
                                >
                                    <AppText type="tag" style={[styles.needText, profile.triggers.loudNoise && styles.needTextActive]}>Loud Noise</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.needChip, profile.triggers.brightLights && styles.needChipActive]}
                                    onPress={() => toggleTrigger('brightLights')}
                                >
                                    <AppText type="tag" style={[styles.needText, profile.triggers.brightLights && styles.needTextActive]}>Bright Lights</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.needChip, profile.triggers.heavyCrowds && styles.needChipActive]}
                                    onPress={() => toggleTrigger('heavyCrowds')}
                                >
                                    <AppText type="tag" style={[styles.needText, profile.triggers.heavyCrowds && styles.needTextActive]}>Heavy Crowds</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.needChip, profile.triggers.strongScents && styles.needChipActive]}
                                    onPress={() => toggleTrigger('strongScents')}
                                >
                                    <AppText type="tag" style={[styles.needText, profile.triggers.strongScents && styles.needTextActive]}>Strong Scents</AppText>
                                </TouchableOpacity>
                            </View>

                            <AppText type="subheader" style={styles.formLabel}>Interests they Love</AppText>
                            <View style={styles.needsContainer}>
                                {['Animals', 'Nature', 'Music', 'Art', 'Dinosaurs'].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[styles.needChip, profile.interests[item.toLowerCase()] && styles.needChipActive]}
                                        onPress={() => toggleInterest(item.toLowerCase())}
                                    >
                                        <AppText type="tag" style={[styles.needText, profile.interests[item.toLowerCase()] && styles.needTextActive]}>{item}</AppText>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Other Interests (e.g. Space, Trains)"
                                value={profile.otherInterests}
                                onChangeText={(text) => setProfile({ ...profile, otherInterests: text })}
                            />
                        </View>
                    )}

                    {/* Progress Dots */}
                    <View style={styles.indicatorContainer}>
                        {ONBOARDING_STEPS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicator,
                                    step === index ? styles.indicatorActive : styles.indicatorInactive
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.footer}>
                        <AppButton
                            title={step === ONBOARDING_STEPS.length - 1 ? "Start Exploring" : "Continue"}
                            onPress={handleNext}
                            style={styles.button}
                        />

                        {step < ONBOARDING_STEPS.length - 1 && (
                            <TouchableOpacity onPress={onClose} style={styles.skipButton}>
                                <AppText type="caption" style={styles.skipText}>Skip for now</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3E5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 24,
    },
    description: {
        textAlign: 'center',
        color: '#555',
        lineHeight: 24,
        marginBottom: 30,
    },
    indicatorContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    indicatorActive: {
        backgroundColor: '#5E35B1',
        width: 20,
    },
    indicatorInactive: {
        backgroundColor: '#B2EBF2',
    },
    footer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '100%',
    },
    skipButton: {
        marginTop: 15,
    },
    skipText: {
        color: '#666',
        textDecorationLine: 'underline',
    },
    profileForm: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    formLabel: {
        fontSize: 16,
        marginBottom: 10,
        color: '#5E35B1',
    },
    needsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    needChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    needChipActive: {
        backgroundColor: '#5E35B1',
        borderColor: '#5E35B1',
    },
    needText: {
        color: '#666',
    },
    needTextActive: {
        color: 'white',
    }
});
