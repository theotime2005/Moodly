Pour lancer l'api tapez : node index.js

Pour créer une migration via knex tapez : npx knex --knexfile knexfile.cjs migrate:make NOM_DE_VOTRE_MIGRATION
    Vous retrouverez votre fichier de migration dans le dossier ./api/migrations/NOM_DE_VOTRE_MIGRATION
        Pour executer votre migration tapez : npx knex migrate:latest --knexfile knexfile.cjs
            Pour vérifier que votre table/modification a bien été appliquée tapez : npx knex migrate:list --knexfile knexfile.cjs