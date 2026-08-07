import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const AppButton = ({
    title,
    onPress,
    type = 'primary',
    loading = false,
    disabled = false,
    style = {},
    textStyle = {},
    ...props
}) => {
    const isSecondary = type === 'secondary';
    const isOutline = type === 'outline';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                isSecondary && styles.secondaryButton,
                isOutline && styles.outlineButton,
                disabled && styles.disabledButton,
                style
            ]}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? '#5E35B1' : 'white'} />
            ) : (
                <Text style={[
                    styles.text,
                    isOutline && styles.outlineText,
                    textStyle
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#5E35B1',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    secondaryButton: {
        backgroundColor: '#7E57C2',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#5E35B1',
        elevation: 0,
        shadowOpacity: 0,
    },
    disabledButton: {
        backgroundColor: '#B2EBF2',
        elevation: 0,
        shadowOpacity: 0,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    outlineText: {
        color: '#5E35B1',
    },
});

export default AppButton;
