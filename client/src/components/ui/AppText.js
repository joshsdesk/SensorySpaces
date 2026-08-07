import React from 'react';
import { Text, StyleSheet } from 'react-native';

const AppText = ({ children, type = 'body', style = {}, ...props }) => {
    return (
        <Text
            style={[
                styles.text,
                styles[type],
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#333',
        fontFamily: 'System', // Standard iOS/Android font
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5E35B1',
        lineHeight: 34,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5E35B1',
        lineHeight: 28,
    },
    subheader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7E57C2',
        lineHeight: 24,
    },
    body: {
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
    },
    caption: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    tag: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5E35B1',
    }
});

export default AppText;
