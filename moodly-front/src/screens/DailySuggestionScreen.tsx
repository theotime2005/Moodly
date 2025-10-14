import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { suggestionService } from "../services/suggestionService";

type DailySuggestionScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "DailySuggestion">,
};

export function DailySuggestionScreen({ navigation }: DailySuggestionScreenProps) {
    const [suggestion, setSuggestion] = useState('');

    useEffect(() => {
        setSuggestion(suggestionService.getDailySuggestion());
    }, []);

    const handleNewSuggestion = () => {
        setSuggestion(suggestionService.getRandomSuggestion());
    };

    return (
        <scrollView>
            <stackLayout style={styles.container}>
                <label style={styles.emoji}>💡</label>
                <label style={styles.title}>Suggestion du jour</label>
                <label style={styles.subtitle}>Un petit conseil pour ton bien-être</label>

                <stackLayout style={styles.card}>
                    <label style={styles.icon}>✨</label>
                    <label style={styles.suggestion}>{suggestion}</label>
                </stackLayout>

                <button
                    style={styles.refreshButton}
                    onTap={handleNewSuggestion}
                    text="🔄 Nouvelle suggestion"
                />

                <button
                    style={styles.backButton}
                    onTap={() => navigation.goBack()}
                    text="← Retour"
                />
            </stackLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF9F0",
        padding: 24,
        paddingTop: 60,
        height: "100%",
    },
    emoji: {
        fontSize: 64,
        textAlignment: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1F2937",
        textAlignment: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlignment: "center",
        marginBottom: 40,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 40,
        marginBottom: 24,
        borderWidth: 3,
        borderColor: "#A8E6CF",
    },
    icon: {
        fontSize: 48,
        textAlignment: "center",
        marginBottom: 20,
    },
    suggestion: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1F2937",
        textAlignment: "center",
        lineHeight: 32,
    },
    refreshButton: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#FFFFFF",
        backgroundColor: "#10B981",
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        textAlignment: "center",
    },
    backButton: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#6B7280",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        textAlignment: "center",
    },
});
