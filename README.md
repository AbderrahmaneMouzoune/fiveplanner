# ⚽ Five Planner

**Five Planner** est une application web moderne et intuitive pour organiser et gérer vos sessions de football 5v5. Créée avec Next.js et TypeScript, elle offre une expérience utilisateur fluide et responsive pour planifier vos matchs, gérer vos joueurs et suivre vos statistiques.

![Five Planner Screenshot](https://via.placeholder.com/800x400/16a34a/ffffff?text=Five+Planner)

## ✨ Fonctionnalités

### 🎯 Gestion des Sessions

- **Création rapide** : Créez une session en quelques clics
- **Import depuis email** : Analysez automatiquement vos emails de réservation
- **Gestion des réponses** : Suivez qui vient, qui est optionnel, qui est absent
- **Partage intelligent** : Partagez facilement les détails de votre session
- **Ajout au calendrier** : Intégration Google Calendar en un clic

### 👥 Gestion des Joueurs

- **Base de données complète** : Noms, emails, téléphones, groupes
- **Import depuis contacts** : Ajoutez rapidement vos contacts
- **Groupes personnalisés** : Organisez vos joueurs (Réguliers, Occasionnels, etc.)
- **Avatars uniques** : Système de couleurs intelligent pour identifier chaque joueur
- **Ajout en lot** : Ajoutez plusieurs joueurs simultanément

### 🏟️ Gestion des Terrains

- **Terrains prédéfinis** : Base de données des terrains populaires (LE FIVE, etc.)
- **Terrains personnalisés** : Ajoutez vos terrains favoris
- **Informations détaillées** : Type de surface, prix, équipements
- **Géolocalisation** : Adresses complètes pour faciliter l'accès

### 📊 Statistiques et Historique

- **Historique complet** : Toutes vos sessions passées
- **Statistiques joueurs** : Taux de participation, présence
- **Scores des matchs** : Enregistrez les résultats
- **Analyses visuelles** : Graphiques et métriques

### 🎨 Interface Moderne

- **Design responsive** : Parfait sur mobile, tablette et desktop
- **Mode sombre/clair** : Thème adaptatif selon vos préférences
- **PWA Ready** : Installez l'app sur votre téléphone
- **Animations fluides** : Interface moderne et agréable

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

1. **Clonez le repository**
   \`\`\`bash
   git clone <https://github.com/AbderrahmaneMouzoune/fiveplanner.git>
   cd five-planner
   \`\`\`

2. **Installez les dépendances**
   \`\`\`bash
   npm install

# ou

yarn install
\`\`\`

3. **Configurez les variables d'environnement (optionnel)**
   \`\`\`bash
   cp .env.example .env.local

# Éditez .env.local avec vos clés PostHog si nécessaire

\`\`\`

4. **Lancez le serveur de développement**
   \`\`\`bash
   npm run dev

# ou

yarn dev
\`\`\`

5. **Ouvrez votre navigateur**
   \`\`\`
   <http://localhost:3000>
   \`\`\`

## 🛠️ Technologies Utilisées

### Frontend

- **[Next.js 15](https://nextjs.org/)** - Framework React avec App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[Radix UI](https://www.radix-ui.com/)** - Composants accessibles
- **[Lucide React](https://lucide.dev/)** - Icônes modernes

### Outils de Développement

- **[Prettier](https://prettier.io/)** - Formatage automatique du code
- **[ESLint](https://eslint.org/)** - Linting et qualité du code
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Linting sur les fichiers stagés

### Analytics (Optionnel)

- **[PostHog](https://posthog.com/)** - Analytics et tracking utilisateur

### Fonctionnalités

- **LocalStorage** - Stockage local des données
- **PWA** - Application web progressive
- **Responsive Design** - Compatible tous écrans
- **Dark Mode** - Thème sombre/clair

## 🧑‍💻 Développement

### Scripts Disponibles

\`\`\`bash

# Développement

npm run dev # Lance le serveur de développement
npm run build # Build de production
npm run start # Lance le serveur de production

# Qualité du code

npm run lint # Vérifie le linting
npm run lint:fix # Corrige automatiquement les erreurs de linting
npm run format # Formate le code avec Prettier
npm run format:check # Vérifie le formatage
npm run type-check # Vérifie les types TypeScript
\`\`\`

### Git Hooks

Le projet utilise Husky pour automatiser la qualité du code :

- **pre-commit** : Lance lint-staged qui vérifie et formate automatiquement les fichiers modifiés
- **Formatage automatique** : Prettier et ESLint s'exécutent sur chaque commit

### GitHub Actions

Deux workflows automatisés :

1. **CI** (`ci.yml`) :
   - Vérifie le linting, formatage et types
   - Build l'application
   - S'exécute sur chaque PR et push

2. **Auto Format PR** (`format-pr.yml`) :
   - Formate automatiquement le code des PR
   - Commit les changements si nécessaire

## 📱 Utilisation

### 1. Créer une Session

1. Cliquez sur "Nouvelle session"
2. Remplissez les informations (date, heure, lieu)
3. Sélectionnez un terrain ou ajoutez-en un nouveau
4. Définissez le nombre maximum de joueurs

### 2. Gérer les Joueurs

1. Ajoutez vos joueurs via "Ajouter un joueur"
2. Importez depuis vos contacts (sur mobile)
3. Organisez-les en groupes
4. Suivez leurs réponses en temps réel

### 3. Suivre les Réponses

1. Les joueurs apparaissent dans différentes catégories
2. Utilisez les filtres pour voir qui vient/ne vient pas
3. Relancez les joueurs en attente
4. Partagez la session facilement

### 4. Terminer une Session

1. Enregistrez le score final (optionnel)
2. La session passe automatiquement dans l'historique
3. Consultez les statistiques de participation

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

### Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une [issue](https://github.com/AbderrahmaneMouzoune/fiveplanner/issues)
3. Décrivez le problème avec des détails précis
4. Ajoutez des captures d'écran si possible

### Proposer une Fonctionnalité

1. Créez une [issue](https://github.com/AbderrahmaneMouzoune/fiveplanner/issues) avec le label "enhancement"
2. Décrivez la fonctionnalité souhaitée
3. Expliquez pourquoi elle serait utile

### Développer

1. **Fork** le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Standards de Code

- Le code est automatiquement formaté avec Prettier
- ESLint vérifie la qualité du code
- Les types TypeScript sont obligatoires
- Les tests sur mobile et desktop sont recommandés

## 🔒 Confidentialité

Five Planner respecte votre vie privée :

- **Stockage local** : Toutes vos données restent sur votre appareil
- **Analytics optionnels** : PostHog n'est activé qu'avec votre consentement
- **Pas de tracking** : Aucun tracking sans consentement explicite
- **Open source** : Code transparent et auditable

## 📋 Roadmap

### Version 1.1

- [ ] Notifications push pour les rappels
- [ ] Export des données (CSV, PDF)
- [ ] Intégration WhatsApp pour les invitations
- [ ] Système de paiement intégré

### Version 1.2

- [ ] Mode multi-équipes
- [ ] Tournois et championnats
- [ ] Statistiques avancées
- [ ] API publique

### Version 2.0

- [ ] Backend avec base de données
- [ ] Comptes utilisateurs
- [ ] Synchronisation multi-appareils
- [ ] Application mobile native

## 🐛 Problèmes Connus

- L'import de contacts ne fonctionne que sur certains navigateurs mobiles
- Les notifications ne sont pas encore implémentées
- L'export des données est en cours de développement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Équipe

**Five Planner Team**

- Site web: [fiveplanner.fr](https://fiveplanner.fr)
- Email: <contact@abderrahmanemouzoune.fr>
- GitHub: [@AbderrahmaneMouzoune](https://github.com/AbderrahmaneMouzoune)

## 🙏 Remerciements

- [Vercel](https://vercel.com) pour l'hébergement
- [Radix UI](https://www.radix-ui.com/) pour les composants
- [Lucide](https://lucide.dev/) pour les icônes
- [PostHog](https://posthog.com/) pour les analytics
- La communauté open source pour l'inspiration

## 📞 Support

Si vous avez des questions ou besoin d'aide :

1. Consultez la [documentation](https://github.com/AbderrahmaneMouzoune/fiveplanner/wiki)
2. Recherchez dans les [issues existantes](https://github.com/AbderrahmaneMouzoune/fiveplanner/issues)
3. Créez une nouvelle issue si nécessaire
4. Contactez-nous par email : <contact@abderrahmanemouzoune.fr>

---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous plaît !**

🌐 **Visitez [fiveplanner.fr](https://fiveplanner.fr) pour utiliser l'application**
