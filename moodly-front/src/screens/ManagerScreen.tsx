import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { RouteProp } from '@react-navigation/core';
import { MainStackParamList } from "../NavigationParamList";
import { localDataService, MoodEntry } from "../services/localDataService";

type MoodStats = {
  happy: number;
  neutral: number;
  sad: number;
  total: number;
  avgScore: number;
};

type ManagerScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Manager">,
    route: RouteProp<MainStackParamList, "Manager">,
};

export function ManagerScreen({ navigation, route }: ManagerScreenProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [todayStats, setTodayStats] = useState<MoodStats>({ happy: 0, neutral: 0, sad: 0, total: 0, avgScore: 0 });
    const [allEntries, setAllEntries] = useState<MoodEntry[]>([]);
    const [avgScore, setAvgScore] = useState(0);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsLoading(true);

        const todayEntries = localDataService.getTodayMoodEntries();
        const allMoodEntries = localDataService.getAllMoodEntries(30);

        const today = localDataService.calculateStats(todayEntries);
        setTodayStats(today);
        setAllEntries(allMoodEntries);

        if (allMoodEntries.length > 0) {
            const grouped = new Map<string, MoodEntry[]>();
            allMoodEntries.forEach(entry => {
                const date = new Date(entry.created_at).toISOString().split('T')[0];
                if (!grouped.has(date)) {
                    grouped.set(date, []);
                }
                grouped.get(date)?.push(entry);
            });

            const dailyScores: number[] = [];
            grouped.forEach((dayEntries) => {
                const stats = localDataService.calculateStats(dayEntries);
                dailyScores.push(stats.avgScore);
            });

            const avg = dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length;
            setAvgScore(avg);

            if (dailyScores.length >= 7) {
                const lastWeek = dailyScores.slice(-7);
                const prevWeek = dailyScores.slice(-14, -7);
                const lastWeekAvg = lastWeek.reduce((a, b) => a + b, 0) / lastWeek.length;
                const prevWeekAvg = prevWeek.length > 0 ? prevWeek.reduce((a, b) => a + b, 0) / prevWeek.length : lastWeekAvg;
                const trendCalc = prevWeekAvg > 0 ? ((lastWeekAvg - prevWeekAvg) / prevWeekAvg) * 100 : 0;
                setTrend(trendCalc);
            }
        }

        setIsLoading(false);
    };

    const getMoodStatus = () => {
        if (todayStats.avgScore > 2.5) return '🚀 Excellent';
        if (todayStats.avgScore > 2) return '👍 Bon';
        if (todayStats.avgScore > 1.5) return '⚠️ Attention';
        return '🛑 Alerte';
    };

    return (
        <scrollView>
            <stackLayout style={styles.container}>
                <label style={styles.emoji}>📊</label>
                <label style={styles.title}>Tableau de bord</label>
                <label style={styles.subtitle}>Vue d'ensemble du bien-être de l'équipe</label>

                {isLoading ? (
                    <stackLayout style={styles.loadingCard}>
                        <label style={styles.loadingText}>⌛ Chargement...</label>
                    </stackLayout>
                ) : (
                    <stackLayout>
                        <label style={styles.sectionTitle}>📈 Métriques clés</label>

                        <stackLayout style={styles.statsRow}>
                            <stackLayout style={styles.statCard}>
                                <label style={styles.statIcon}>⭐</label>
                                <label style={styles.statValue}>{avgScore.toFixed(2)}</label>
                                <label style={styles.statLabel}>Score moyen</label>
                                <label style={styles.statSub}>sur 3.00</label>
                            </stackLayout>

                            <stackLayout style={trend >= 0 ? styles.statCardPositive : styles.statCardNegative}>
                                <label style={styles.statIcon}>{trend >= 0 ? '📈' : '📉'}</label>
                                <label style={trend >= 0 ? styles.statValueGreen : styles.statValueRed}>
                                    {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                                </label>
                                <label style={styles.statLabel}>Tendance</label>
                                <label style={styles.statSub}>vs semaine</label>
                            </stackLayout>
                        </stackLayout>

                        <stackLayout style={styles.statsRow}>
                            <stackLayout style={styles.statCard}>
                                <label style={styles.statIcon}>📝</label>
                                <label style={styles.statValue}>{todayStats.total}</label>
                                <label style={styles.statLabel}>Aujourd'hui</label>
                                <label style={styles.statSub}>réponses</label>
                            </stackLayout>

                            <stackLayout style={styles.statCard}>
                                <label style={styles.statIcon}>📅</label>
                                <label style={styles.statValue}>{allEntries.length}</label>
                                <label style={styles.statLabel}>30 jours</label>
                                <label style={styles.statSub}>entrées</label>
                            </stackLayout>
                        </stackLayout>
                    </stackLayout>
                )}

                {!isLoading && todayStats.total > 0 && (
                    <stackLayout style={styles.card}>
                        <label style={styles.cardTitle}>🎯 Répartition aujourd'hui</label>

                        <stackLayout orientation="horizontal" style={styles.moodRow}>
                            <stackLayout style={styles.moodCardHappy}>
                                <label style={styles.moodEmoji}>😊</label>
                                <label style={styles.moodCount}>{todayStats.happy}</label>
                                <label style={styles.moodLabel}>Bien</label>
                            </stackLayout>

                            <stackLayout style={styles.moodCardNeutral}>
                                <label style={styles.moodEmoji}>😐</label>
                                <label style={styles.moodCount}>{todayStats.neutral}</label>
                                <label style={styles.moodLabel}>Moyen</label>
                            </stackLayout>

                            <stackLayout style={styles.moodCardSad}>
                                <label style={styles.moodEmoji}>😞</label>
                                <label style={styles.moodCount}>{todayStats.sad}</label>
                                <label style={styles.moodLabel}>Difficile</label>
                            </stackLayout>
                        </stackLayout>

                        <stackLayout style={styles.statusBar}>
                            <label style={styles.statusText}>Moral général : {getMoodStatus()}</label>
                        </stackLayout>
                    </stackLayout>
                )}

                {!isLoading && todayStats.total === 0 && (
                    <stackLayout style={styles.card}>
                        <label style={styles.emptyTitle}>📊 Aucune donnée aujourd'hui</label>
                        <label style={styles.emptyText}>Les employés n'ont pas encore partagé leur ressenti.</label>
                    </stackLayout>
                )}

                <button
                    style={styles.refreshButton}
                    onTap={loadData}
                    text="🔄 Actualiser les données"
                />

                <button
                    style={styles.quickActionsButton}
                    onTap={() => navigation.navigate('QuickActions')}
                    text="⚡ Actions rapides"
                />

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
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 16,
    },
    loadingCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 48,
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 17,
        color: "#6B7280",
        textAlignment: "center",
        fontWeight: "bold",
    },
    statsRow: {
        orientation: "horizontal",
        horizontalAlignment: "center",
        marginBottom: 12,
    },
    statCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        margin: 6,
        width: 150,
    },
    statCardPositive: {
        backgroundColor: "#D1FAE5",
        borderRadius: 16,
        padding: 16,
        margin: 6,
        width: 150,
    },
    statCardNegative: {
        backgroundColor: "#FECACA",
        borderRadius: 16,
        padding: 16,
        margin: 6,
        width: 150,
    },
    statIcon: {
        fontSize: 28,
        textAlignment: "center",
        marginBottom: 8,
    },
    statValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1F2937",
        textAlignment: "center",
        marginBottom: 4,
    },
    statValueGreen: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#10B981",
        textAlignment: "center",
        marginBottom: 4,
    },
    statValueRed: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#EF4444",
        textAlignment: "center",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        textAlignment: "center",
        fontWeight: "bold",
        marginBottom: 4,
    },
    statSub: {
        fontSize: 11,
        color: "#9CA3AF",
        textAlignment: "center",
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
        marginBottom: 20,
    },
    moodRow: {
        horizontalAlignment: "center",
        marginBottom: 20,
    },
    moodCardHappy: {
        backgroundColor: "#D1FAE5",
        borderRadius: 16,
        padding: 16,
        margin: 6,
        width: 90,
    },
    moodCardNeutral: {
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        padding: 16,
        margin: 6,
        width: 90,
    },
    moodCardSad: {
        backgroundColor: "#FECACA",
        borderRadius: 16,
        padding: 16,
        margin: 6,
        width: 90,
    },
    moodEmoji: {
        fontSize: 36,
        textAlignment: "center",
        marginBottom: 8,
    },
    moodCount: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1F2937",
        textAlignment: "center",
        marginBottom: 4,
    },
    moodLabel: {
        fontSize: 12,
        color: "#374151",
        textAlignment: "center",
        fontWeight: "bold",
    },
    statusBar: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 14,
    },
    statusText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#1F2937",
        textAlignment: "center",
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#6B7280",
        textAlignment: "center",
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: "#9CA3AF",
        textAlignment: "center",
    },
    refreshButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1F2937",
        backgroundColor: "#DBEAFE",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        textAlignment: "center",
    },
    quickActionsButton: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#FFFFFF",
        backgroundColor: "#8B5CF6",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        textAlignment: "center",
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
