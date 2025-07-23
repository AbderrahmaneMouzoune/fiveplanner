# 🤝 Guide de Contribution - Five Planner

Merci de votre intérêt pour contribuer à Five Planner ! Ce guide vous aidera à comprendre comment participer au développement du projet.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Signaler un Bug](#signaler-un-bug)
- [Proposer une Fonctionnalité](#proposer-une-fonctionnalité)
- [Développement](#développement)
- [Standards de Code](#standards-de-code)
- [Process de Review](#process-de-review)

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md). Nous nous engageons à maintenir un environnement accueillant et inclusif pour tous.

## 🚀 Comment Contribuer

Il existe plusieurs façons de contribuer à Five Planner :

### 🐛 Signaler des Bugs
- Utilisez les [issues GitHub](https://github.com/votre-username/five-planner/issues)
- Vérifiez d'abord que le bug n'a pas déjà été signalé
- Utilisez le template de bug report

### 💡 Proposer des Fonctionnalités
- Créez une issue avec le label "enhancement"
- Décrivez clairement la fonctionnalité souhaitée
- Expliquez le cas d'usage et les bénéfices

### 🔧 Corriger des Bugs
- Regardez les issues avec le label "bug"
- Commentez l'issue pour indiquer que vous travaillez dessus
- Suivez le process de développement ci-dessous

### ✨ Ajouter des Fonctionnalités
- Regardez les issues avec le label "enhancement"
- Discutez de l'implémentation avant de commencer
- Suivez le process de développement

## 🐛 Signaler un Bug

### Avant de Signaler
1. **Vérifiez les issues existantes** - Le bug a peut-être déjà été signalé
2. **Testez sur la dernière version** - Le bug a peut-être été corrigé
3. **Reproduisez le bug** - Assurez-vous qu'il est reproductible

### Template de Bug Report
\`\`\`markdown
**Description du Bug**
Une description claire et concise du bug.

**Étapes pour Reproduire**
1. Allez sur '...'
2. Cliquez sur '...'
3. Faites défiler jusqu'à '...'
4. Voyez l'erreur

**Comportement Attendu**
Une description claire de ce qui devrait se passer.

**Captures d'Écran**
Si applicable, ajoutez des captures d'écran.

**Environnement:**
 - OS: [ex: iOS, Windows, macOS]
 - Navigateur: [ex: Chrome, Safari, Firefox]
 - Version: [ex: 22]
 - Appareil: [ex: iPhone 12, Desktop]

**Contexte Additionnel**
Ajoutez tout autre contexte utile.
\`\`\`

## 💡 Proposer une Fonctionnalité

### Template de Feature Request
\`\`\`markdown
**La Fonctionnalité Résout-elle un Problème ?**
Une description claire du problème. Ex: Je suis frustré quand [...]

**Solution Souhaitée**
Une description claire de ce que vous aimeriez voir.

**Alternatives Considérées**
Une description des solutions alternatives que vous avez considérées.

**Contexte Additionnel**
Ajoutez tout autre contexte ou captures d'écran.
\`\`\`

## 🔧 Développement

### Configuration de l'Environnement

1. **Fork le repository**
\`\`\`bash
# Cliquez sur "Fork" sur GitHub
\`\`\`

2. **Clonez votre fork**
\`\`\`bash
git clone https://github.com/votre-username/five-planner.git
cd five-planner
\`\`\`

3. **Ajoutez le repository original comme remote**
\`\`\`bash
git remote add upstream https://github.com/original-username/five-planner.git
\`\`\`

4. **Installez les dépendances**
\`\`\`bash
npm install
\`\`\`

5. **Lancez le serveur de développement**
\`\`\`bash
npm run dev
\`\`\`

### Workflow de Développement

1. **Créez une branche pour votre fonctionnalité**
\`\`\`bash
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
\`\`\`

2. **Développez votre fonctionnalité**
- Écrivez du code propre et documenté
- Suivez les standards de code
- Testez vos changements

3. **Committez vos changements**
\`\`\`bash
git add .
git commit -m "feat: ajoute la fonctionnalité X"
# ou
git commit -m "fix: corrige le bug Y"
\`\`\`

4. **Poussez vers votre fork**
\`\`\`bash
git push origin feature/nom-de-la-fonctionnalite
\`\`\`

5. **Créez une Pull Request**
- Allez sur GitHub
- Cliquez sur "New Pull Request"
- Remplissez le template de PR

### Convention de Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

\`\`\`
type(scope): description

[body optionnel]

[footer optionnel]
\`\`\`

**Types :**
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatage, point-virgules manquants, etc.
- `refactor`: refactoring du code
- `test`: ajout de tests
- `chore`: maintenance

**Exemples :**
\`\`\`bash
feat(session): ajoute la création de session depuis email
fix(player): corrige l'affichage des avatars
docs(readme): met à jour les instructions d'installation
\`\`\`

## 📏 Standards de Code

### TypeScript
- Utilisez TypeScript pour tout nouveau code
- Définissez des types explicites
- Évitez `any`, utilisez des types spécifiques

### React/Next.js
- Utilisez les hooks React modernes
- Préférez les composants fonctionnels
- Utilisez Next.js App Router

### Styling
- Utilisez Tailwind CSS pour le styling
- Suivez les conventions de nommage
- Utilisez les variables CSS personnalisées

### Structure des Fichiers
\`\`\`
components/
  ├── ui/           # Composants de base (Button, Input, etc.)
  ├── views/        # Vues principales
  └── [feature]/    # Composants spécifiques à une fonctionnalité

hooks/              # Hooks personnalisés
utils/              # Fonctions utilitaires
types/              # Définitions TypeScript
\`\`\`

### Bonnes Pratiques

1. **Nommage**
   - Utilisez camelCase pour les variables et fonctions
   - Utilisez PascalCase pour les composants
   - Utilisez kebab-case pour les fichiers

2. **Composants**
   - Un composant par fichier
   - Props typées avec TypeScript
   - Documentation JSDoc pour les composants complexes

3. **Performance**
   - Utilisez `useMemo` et `useCallback` quand approprié
   - Évitez les re-renders inutiles
   - Optimisez les images

4. **Accessibilité**
   - Utilisez des éléments sémantiques
   - Ajoutez des attributs ARIA
   - Testez avec un lecteur d'écran

## 🔍 Process de Review

### Checklist avant PR
- [ ] Le code compile sans erreurs
- [ ] Les tests passent (quand ils existent)
- [ ] Le code suit les standards du projet
- [ ] La documentation est mise à jour si nécessaire
- [ ] Les changements sont testés sur mobile et desktop

### Template de Pull Request
\`\`\`markdown
## Description
Décrivez brièvement vos changements.

## Type de Changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (fix ou fonctionnalité qui casserait la fonctionnalité existante)
- [ ] Documentation

## Comment Tester
Décrivez comment tester vos changements.

## Captures d'Écran
Si applicable, ajoutez des captures d'écran.

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai testé mes changements
- [ ] J'ai mis à jour la documentation si nécessaire
\`\`\`

### Process de Review
1. **Review automatique** - Les checks automatiques doivent passer
2. **Review par les pairs** - Au moins une approbation requise
3. **Tests** - Vérification manuelle si nécessaire
4. **Merge** - Squash and merge par défaut

## 🎯 Priorités Actuelles

Nous recherchons particulièrement de l'aide sur :

- 🐛 **Corrections de bugs** - Voir les issues avec le label "bug"
- 📱 **Amélioration mobile** - Optimisation de l'expérience mobile
- ♿ **Accessibilité** - Amélioration de l'accessibilité
- 🌐 **Internationalisation** - Support de plusieurs langues
- 📊 **Tests** - Ajout de tests unitaires et d'intégration

## 📞 Besoin d'Aide ?

- 💬 **Discussions** - Utilisez les [GitHub Discussions](https://github.com/votre-username/five-planner/discussions)
- 📧 **Email** - Contactez-nous à votre.email@example.com
- 🐛 **Issues** - Pour les bugs et fonctionnalités

## 🙏 Reconnaissance

Tous les contributeurs seront ajoutés au fichier [CONTRIBUTORS.md](CONTRIBUTORS.md) et mentionnés dans les release notes.

Merci de contribuer à Five Planner ! 🚀
