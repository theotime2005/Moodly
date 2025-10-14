import * as React from "react";
import { useState } from "react";
import { Dialogs, Clipboard } from '@nativescript/core';
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";

type QuickActionsScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "QuickActions">,
};

const encouragingMessages = [
    "Merci à toute l'équipe pour votre engagement ! Vous faites un travail formidable 💪",
    "Prenons le temps de célébrer nos réussites récentes. Bravo à tous ! 🎉",
    "Votre bien-être est important. N'hésitez pas à prendre des pauses quand vous en avez besoin 🌿",
    "Je suis fier de travailler avec une équipe aussi motivée et soudée ! 🙌",
    "Continuons ensemble, étape par étape. Vous êtes sur la bonne voie ! 🚀",
];

const teamActivities = [
    "☕ Organiser une pause café d'équipe (30 min)",
    "🍕 Déjeuner d'équipe décontracté",
    "🎮 Session team building ludique",
    "🚶 Marche collective (15 min)",
    "🎉 Célébration des petites victoires",
    "💬 Point informel en visio détendue",
];

const improvementChecklist = [
    "✅ Vérifier la charge de travail de chacun",
    "✅ Planifier des 1-on-1 avec l'équipe",
    "✅ Clarifier les priorités de la semaine",
    "✅ Améliorer la communication interne",
    "✅ Identifier les blocages",
    "✅ Reconnaître publiquement les contributions",
    "✅ Mettre en place des rituels d'équipe",
    "✅ Favoriser l'autonomie et la confiance",
];

export function QuickActionsScreen({ navigation }: QuickActionsScreenProps) {
    const [selectedMessage, setSelectedMessage] = useState(0);
    const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(improvementChecklist.length).fill(false));

    const copyMessage = () => {
        const message = encouragingMessages[selectedMessage];
        Clipboard.setText(message);
        Dialogs.alert({
            title: "Copié !",
            message: "Message copié dans le presse-papiers",
            okButtonText: "OK"
        });
    };

    const selectMessage = () => {
        Dialogs.action({
            message: "Choisir un message",
            cancelButtonText: "Annuler",
            actions: encouragingMessages.map((msg, i) => `Message ${i + 1}`)
        }).then((result) => {
            if (result !== "Annuler") {
                const index = parseInt(result.replace("Message ", "")) - 1;
                if (index >= 0) setSelectedMessage(index);
            }
        });
    };

    const selectActivity = () => {
        Dialogs.action({
            message: "Activité d'équipe",
            cancelButtonText: "Annuler",
            actions: teamActivities
        }).then((result) => {
            if (result !== "Annuler") {
                Dialogs.alert({
                    title: "Bonne idée !",
                    message: `"${result}"\n\nPense à planifier cette activité avec ton équipe !`,
                    okButtonText: "OK"
                });
            }
        });
    };

    const toggleCheckItem = (index: number) => {
        const newChecked = [...checkedItems];
        newChecked[index] = !newChecked[index];
        setCheckedItems(newChecked);
    };

    const resetChecklist = () => {
        setCheckedItems(new Array(improvementChecklist.length).fill(false));
        Dialogs.alert({
            title: "Réinitialisé",
            message: "La checklist a été réinitialisée",
            okButtonText: "OK"
        });
    };

    return (
        <scrollView>
            <stackLayout style={styles.container}>
                <label style={styles.emoji}>⚡</label>
                <label style={styles.title}>Actions rapides</label>
                <label style={styles.subtitle}>Outils pour manager avec bienveillance</label>

                <stackLayout style={styles.card}>
                    <label style={styles.cardTitle}>💬 Messages encourageants</label>
                    <label style={styles.messagePreview}>{encouragingMessages[selectedMessage]}</label>

                    <stackLayout orientation="horizontal" style={styles.buttonRow}>
                        <button
                            style={styles.halfButton}
                            onTap={selectMessage}
                            text="Changer"
                        />
                        <button
                            style={styles.halfButtonPrimary}
                            onTap={copyMessage}
                            text="📋 Copier"
                        />
                    </stackLayout>
                </stackLayout>

                <stackLayout style={styles.card}>
                    <label style={styles.cardTitle}>🎯 Activités d'équipe</label>
                    <label style={styles.description}>Renforcez la cohésion et le bien-être collectif</label>

                    <button
                        style={styles.activityButton}
                        onTap={selectActivity}
                        text="🎲 Voir les idées"
                    />
                </stackLayout>

                <stackLayout style={styles.card}>
                    <label style={styles.cardTitle}>📋 Checklist amélioration</label>

                    {improvementChecklist.map((item, index) => (
                        <button
                            key={index}
                            style={checkedItems[index] ? styles.checkItemChecked : styles.checkItem}
                            onTap={() => toggleCheckItem(index)}
                            text={checkedItems[index] ? item.replace('✅', '✓') : item.replace('✅', '○')}
                        />
                    ))}

                    <button
                        style={styles.resetButton}
                        onTap={resetChecklist}
                        text="🔄 Réinitialiser"
                    />
                </stackLayout>

                <button
                    style={styles.backButton}
                    onTap={() => navigation.goBack()}
                    text="← Retour au tableau de bord"
                />
            </stackLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#EFF6FF",
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
        fontSize: 15,
        color: "#6B7280",
        textAlignment: "center",
        marginBottom: 32,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 16,
    },
    messagePreview: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 22,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 16,
    },
    buttonRow: {
        horizontalAlignment: "center",
    },
    halfButton: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#6B7280",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 14,
        width: 135,
        margin: 4,
        textAlignment: "center",
    },
    halfButtonPrimary: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#FFFFFF",
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        padding: 14,
        width: 135,
        margin: 4,
        textAlignment: "center",
    },
    activityButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        backgroundColor: "#8B5CF6",
        borderRadius: 12,
        padding: 16,
        textAlignment: "center",
    },
    checkItem: {
        fontSize: 14,
        color: "#374151",
        backgroundColor: "#F9FAFB",
        borderRadius: 10,
        padding: 14,
        marginBottom: 8,
        textAlignment: "left",
    },
    checkItemChecked: {
        fontSize: 14,
        color: "#059669",
        backgroundColor: "#D1FAE5",
        borderRadius: 10,
        padding: 14,
        marginBottom: 8,
        textAlignment: "left",
        fontWeight: "bold",
    },
    resetButton: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#6B7280",
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        padding: 12,
        marginTop: 8,
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
