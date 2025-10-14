import * as React from "react";
import { useState } from "react";
import { Dialogs } from '@nativescript/core';
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { localDataService } from "../services/localDataService";

type LoginScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Login">,
};

export function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!email) {
            Dialogs.alert({
                title: "Erreur",
                message: "Veuillez entrer votre email",
                okButtonText: "OK"
            });
            return;
        }

        setIsLoading(true);
        const profile = localDataService.loginWithEmail(email);
        setIsLoading(false);

        if (profile) {
            if (profile.role === 'employee') {
                navigation.navigate('Employee', { userId: profile.id });
            } else if (profile.role === 'manager') {
                navigation.navigate('Manager', { userId: profile.id });
            }
        } else {
            Dialogs.alert({
                title: "Erreur",
                message: "Email non trouvé. Essayez employee@moodly.com ou manager@moodly.com",
                okButtonText: "OK"
            });
        }
    };

    const handleQuickLogin = (testEmail: string) => {
        setEmail(testEmail);
        setIsLoading(true);
        const profile = localDataService.loginWithEmail(testEmail);
        setIsLoading(false);

        if (profile) {
            if (profile.role === 'employee') {
                navigation.navigate('Employee', { userId: profile.id });
            } else if (profile.role === 'manager') {
                navigation.navigate('Manager', { userId: profile.id });
            }
        }
    };

    return (
        <scrollView>
            <stackLayout style={styles.container}>
                <label style={styles.logo}>🌟</label>
                <label style={styles.title}>Moodly</label>
                <label style={styles.subtitle}>Cultivez le bien-être au quotidien</label>
                <label style={styles.tagline}>Simple • Confidentiel • Impactant</label>

                <stackLayout style={styles.form}>
                    <label style={styles.label}>📧 Email</label>
                    <textField
                        style={styles.input}
                        hint="votre@email.com"
                        keyboardType="email"
                        text={email}
                        onTextChange={(args) => setEmail(args.value)}
                        isEnabled={!isLoading}
                        autocorrect={false}
                        autocapitalizationType="none"
                    />

                    <button
                        style={isLoading ? styles.primaryButtonDisabled : styles.primaryButton}
                        onTap={handleLogin}
                        isEnabled={!isLoading}
                        text={isLoading ? 'Connexion...' : 'Se connecter'}
                    />

                    <label style={styles.divider}>Accès rapide</label>

                    <button
                        style={styles.testButton}
                        onTap={() => handleQuickLogin('employee@moodly.com')}
                        isEnabled={!isLoading}
                        text="👤 Employé"
                    />

                    <button
                        style={styles.testButton}
                        onTap={() => handleQuickLogin('manager@moodly.com')}
                        isEnabled={!isLoading}
                        text="👔 Manager"
                    />
                </stackLayout>
            </stackLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#FFF9F0",
        padding: 24,
        paddingTop: 60,
    },
    logo: {
        fontSize: 64,
        marginBottom: 16,
        textAlignment: "center",
    },
    title: {
        fontSize: 38,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 12,
        textAlignment: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        marginBottom: 8,
        textAlignment: "center",
    },
    tagline: {
        fontSize: 14,
        color: "#9CA3AF",
        textAlignment: "center",
        marginBottom: 40,
    },
    form: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        color: "#1F2937",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    primaryButton: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#047857",
        backgroundColor: "#A8E6CF",
        borderRadius: 12,
        padding: 16,
        textAlignment: "center",
    },
    primaryButtonDisabled: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#9CA3AF",
        backgroundColor: "#E5E7EB",
        borderRadius: 12,
        padding: 16,
        textAlignment: "center",
    },
    divider: {
        fontSize: 13,
        color: "#9CA3AF",
        textAlignment: "center",
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 16,
    },
    testButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1F2937",
        backgroundColor: "#DBEAFE",
        borderRadius: 12,
        padding: 14,
        marginTop: 8,
        textAlignment: "center",
    },
});
