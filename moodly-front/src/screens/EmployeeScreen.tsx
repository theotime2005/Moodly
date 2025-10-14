import * as React from "react";
import { useState } from "react";
import { Dialogs } from '@nativescript/core';
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { RouteProp } from '@react-navigation/core';
import { MainStackParamList } from "../NavigationParamList";
import { localDataService } from "../services/localDataService";

type EmployeeScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Employee">,
    route: RouteProp<MainStackParamList, "Employee">,
};

const tags = ['Charge de travail', 'Ambiance', 'Management', 'Autre'];

export function EmployeeScreen({ navigation, route }: EmployeeScreenProps) {
    const { userId } = route.params;
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [selectedTagIndex, setSelectedTagIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!selectedMood || isSubmitting) return;

        setIsSubmitting(true);
        const contextTag = tags[selectedTagIndex] !== 'Autre' ? tags[selectedTagIndex] : undefined;
        const success = localDataService.createMoodEntry(
            userId,
            selectedMood as 'happy' | 'neutral' | 'sad',
            contextTag
        );
        setIsSubmitting(false);

        if (success) {
            Dialogs.alert({
                title: "Merci !",
                message: "Ton ressenti a bien été enregistré",
                okButtonText: "OK"
            }).then(() => {
                setSelectedMood(null);
                setSelectedTagIndex(0);
            });
        } else {
            Dialogs.alert({
                title: "Erreur",
                message: "Une erreur est survenue. Réessaye plus tard.",
                okButtonText: "OK"
            });
        }
    };

    const selectTag = () => {
        Dialogs.action({
            message: "Contexte",
            cancelButtonText: "Annuler",
            actions: tags
        }).then((result) => {
            if (result !== "Annuler") {
                const index = tags.indexOf(result);
                if (index >= 0) setSelectedTagIndex(index);
            }
        });
    };

    return (
        <scrollView>
            <stackLayout style={styles.container}>
                <label style={styles.emoji}>💚</label>
                <label style={styles.title}>Comment te sens-tu ?</label>
                <label style={styles.subtitle}>Prends un moment pour toi</label>

                <stackLayout style={styles.card}>
                    <label style={styles.sectionLabel}>🌟 Ton état d'esprit</label>

                    <stackLayout orientation="horizontal" style={styles.moodRow}>
                        <button
                            style={selectedMood === 'happy' ? styles.moodButtonHappy : styles.moodButton}
                            onTap={() => setSelectedMood('happy')}
                            text="😊"
                        />
                        <button
                            style={selectedMood === 'neutral' ? styles.moodButtonNeutral : styles.moodButton}
                            onTap={() => setSelectedMood('neutral')}
                            text="😐"
                        />
                        <button
                            style={selectedMood === 'sad' ? styles.moodButtonSad : styles.moodButton}
                            onTap={() => setSelectedMood('sad')}
                            text="😞"
                        />
                    </stackLayout>

                    <stackLayout orientation="horizontal" style={styles.labelRow}>
                        <label style={styles.moodLabel}>Bien</label>
                        <label style={styles.moodLabel}>Moyen</label>
                        <label style={styles.moodLabel}>Difficile</label>
                    </stackLayout>

                    <label style={styles.sectionLabel}>🎯 Contexte (optionnel)</label>
                    <button
                        style={styles.selectButton}
                        onTap={selectTag}
                        text={tags[selectedTagIndex]}
                    />

                    <button
                        style={selectedMood && !isSubmitting ? styles.submitButton : styles.submitButtonDisabled}
                        onTap={handleSubmit}
                        isEnabled={!!selectedMood && !isSubmitting}
                        text={isSubmitting ? 'Envoi en cours...' : 'Envoyer mon ressenti'}
                    />
                </stackLayout>

                <label style={styles.footerNote}>🔒 Tes réponses sont anonymisées</label>

                <button
                    style={styles.suggestionButton}
                    onTap={() => navigation.navigate('DailySuggestion')}
                    text="💡 Suggestion bien-être"
                />

                <button
                    style={styles.backButton}
                    onTap={() => navigation.goBack()}
                    text="← Déconnexion"
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
        color: "#10B981",
        textAlignment: "center",
        fontWeight: "bold",
        marginBottom: 32,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 16,
        marginTop: 8,
    },
    moodRow: {
        horizontalAlignment: "center",
        marginBottom: 12,
    },
    moodButton: {
        fontSize: 48,
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        width: 90,
        height: 90,
        margin: 6,
        textAlignment: "center",
    },
    moodButtonHappy: {
        fontSize: 48,
        backgroundColor: "#D1FAE5",
        borderRadius: 16,
        width: 90,
        height: 90,
        margin: 6,
        textAlignment: "center",
    },
    moodButtonNeutral: {
        fontSize: 48,
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        width: 90,
        height: 90,
        margin: 6,
        textAlignment: "center",
    },
    moodButtonSad: {
        fontSize: 48,
        backgroundColor: "#FECACA",
        borderRadius: 16,
        width: 90,
        height: 90,
        margin: 6,
        textAlignment: "center",
    },
    labelRow: {
        horizontalAlignment: "center",
        marginBottom: 24,
    },
    moodLabel: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "bold",
        width: 102,
        textAlignment: "center",
    },
    selectButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1F2937",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        textAlignment: "center",
    },
    submitButton: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#FFFFFF",
        backgroundColor: "#10B981",
        borderRadius: 12,
        padding: 18,
        textAlignment: "center",
    },
    submitButtonDisabled: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#9CA3AF",
        backgroundColor: "#E5E7EB",
        borderRadius: 12,
        padding: 18,
        textAlignment: "center",
    },
    footerNote: {
        fontSize: 13,
        color: "#9CA3AF",
        textAlignment: "center",
        marginBottom: 16,
    },
    suggestionButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1F2937",
        backgroundColor: "#FEF3C7",
        borderRadius: 12,
        padding: 14,
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
