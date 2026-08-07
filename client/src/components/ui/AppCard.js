import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const AppCard = ({ children, onPress, style = {}, ...props }) => {
    if (onPress) {
        return (
            <TouchableOpacity
                style={[styles.card, style]}
                onPress={onPress}
                activeOpacity={0.9}
                {...props}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
});

export default AppCard;
