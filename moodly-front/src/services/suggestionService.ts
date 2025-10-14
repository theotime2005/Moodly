const suggestions = [
    "Respire profondément 🌬️",
    "Prends une pause café ☕",
    "Étire-toi pendant 5 minutes 🤸",
    "Écoute ta musique préférée 🎵",
    "Fais une courte marche 🚶",
    "Bois un grand verre d'eau 💧",
    "Ferme les yeux 2 minutes 😌",
    "Appelle un proche 📞",
    "Lis quelques pages 📖",
    "Médite 5 minutes 🧘",
    "Prends un goûter sain 🍎",
    "Regarde par la fenêtre 🪟",
    "Fais une pause écran 📴",
    "Écris 3 choses positives ✍️",
    "Souris à quelqu'un 😊",
    "Range ton bureau 🧹",
    "Planifie ta soirée 📅",
    "Fais des exercices de respiration 🫁",
    "Écoute un podcast inspirant 🎧",
    "Prends une vraie pause déjeuner 🍽️",
    "Dis merci à un collègue 🙏",
    "Change de position 💺",
    "Ouvre une fenêtre pour aérer 🌿",
    "Fais une liste de priorités 📝",
    "Prends du recul sur ton travail 🔍",
];

export const suggestionService = {
    getRandomSuggestion(): string {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        return suggestions[randomIndex];
    },

    getDailySuggestion(): string {
        const today = new Date();
        const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        const index = dayOfYear % suggestions.length;
        return suggestions[index];
    },
};
