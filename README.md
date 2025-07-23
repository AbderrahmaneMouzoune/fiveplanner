<div align="center">

<img src="https://fiveplanner.fr/logo/logo.png" alt="Five Planner Logo" width="120" height="120">

<h1>Five Planner</h1>

<h3><em>Une application web moderne et intuitive pour organiser et gérer vos sessions de football 5v5</em></h3>

<img src="https://img.shields.io/github/contributors/AbderrahmaneMouzoune/fiveplanner?style=plastic" alt="Contributors">
<img src="https://img.shields.io/github/forks/AbderrahmaneMouzoune/fiveplanner" alt="Forks">
<img src="https://img.shields.io/github/stars/AbderrahmaneMouzoune/fiveplanner" alt="Stars">
<img src="https://img.shields.io/github/issues/AbderrahmaneMouzoune/fiveplanner" alt="Issues">
<img src="https://img.shields.io/github/repo-size/AbderrahmaneMouzoune/fiveplanner" alt="Repository Size">
<a href="LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
</a>

<a href="https://fiveplanner.fr">
  <img src="https://img.shields.io/badge/Demo-Live-blue?style=flat&logo=vercel&logoColor=white" alt="Live Demo">
</a>

</div>

## 📋 Table of Contents

- [🎬 Demo](#-demo)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Commands](#development-commands)
- [🛠️ Technologies](#️-technologies)
- [📱 Usage Guide](#-usage-guide)
- [🤝 Contributing](#-contributing)
- [🗺️ Roadmap](#️-roadmap)
- [🔒 Privacy](#-privacy)
- [📄 License](#-license)
- [💖 Support](#-support)

---

## 🎬 Demo

![Five Planner Demo](assets/demo.gif)

**🌐 Visitez [fiveplanner.fr](https://fiveplanner.fr) pour utiliser l'application**

## ✨ Features

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

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Installation

**Step 1: Clone the repository**

```bash
git clone https://github.com/AbderrahmaneMouzoune/fiveplanner.git
cd five-planner
```

**Step 2: Install dependencies**

```bash
npm install
# ou
yarn install
```

**Step 3: Set up environment variables (optional)**

```bash
cp .env.example .env.local
# Éditez .env.local avec vos clés PostHog si nécessaire
```

**Step 4: Start development server**

```bash
npm run dev
# ou
yarn dev
```

**Step 5: Access Five Planner**

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
npm run dev        # Lance le serveur de développement
npm run build      # Build de production
npm run start      # Lance le serveur de production
npm run lint       # Vérifie le linting
npm run lint:fix   # Corrige automatiquement les erreurs de linting
npm run format     # Formate le code avec Prettier
npm run type-check # Vérifie les types TypeScript
```

## 🛠️ Technologies

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React avec App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[Radix UI](https://www.radix-ui.com/)** - Composants accessibles
- **[Lucide React](https://lucide.dev/)** - Icônes modernes

### Development Tools
- **[Prettier](https://prettier.io/)** - Formatage automatique du code
- **[ESLint](https://eslint.org/)** - Linting et qualité du code
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Linting sur les fichiers stagés

### Analytics & Features
- **[PostHog](https://posthog.com/)** - Analytics et tracking utilisateur (optionnel)
- **LocalStorage** - Stockage local des données
- **PWA** - Application web progressive
- **Responsive Design** - Compatible tous écrans

## 📱 Usage Guide

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

## 🤝 Contributing

Les contributions sont les bienvenues ! Voici comment participer :

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Make your changes** and test them thoroughly
4. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
5. **Push to your branch**: `git push origin feature/AmazingFeature`
6. **Open a Pull Request**

### Development Guidelines

- Le code est automatiquement formaté avec Prettier
- ESLint vérifie la qualité du code
- Les types TypeScript sont obligatoires
- Les tests sur mobile et desktop sont recommandés

### Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une [issue](https://github.com/AbderrahmaneMouzoune/fiveplanner/issues)
3. Décrivez le problème avec des détails précis
4. Ajoutez des captures d'écran si possible

## 🗺️ Roadmap

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

## 🔒 Privacy

Five Planner respecte votre vie privée :

- **Stockage local** : Toutes vos données restent sur votre appareil
- **Analytics optionnels** : PostHog n'est activé qu'avec votre consentement
- **Pas de tracking** : Aucun tracking sans consentement explicite
- **Open source** : Code transparent et auditable

## 🐛 Known Issues

- L'import de contacts ne fonctionne que sur certains navigateurs mobiles
- Les notifications ne sont pas encore implémentées
- L'export des données est en cours de développement

## 📄 License

MIT License. See the [LICENSE](LICENSE) file for details.

## 💖 Support

Si vous avez des questions ou besoin d'aide :

1. Consultez la [documentation](https://github.com/AbderrahmaneMouzoune/fiveplanner/wiki)
2. Recherchez dans les [issues existantes](https://github.com/AbderrahmaneMouzoune/fiveplanner/issues)
3. Créez une nouvelle issue si nécessaire
4. Contactez-nous par email : contact@abderrahmanemouzoune.fr

<div align="center">

Si Five Planner vous aide à organiser vos sessions de foot, [⭐ star the repo](https://github.com/AbderrahmaneMouzoune/fiveplanner) ou visitez [fiveplanner.fr](https://fiveplanner.fr)

<sub>Built with ⚽ by [Abderrahmane Mouzoune](https://github.com/AbderrahmaneMouzoune) • Keep playing</sub>

</div>
