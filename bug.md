# Bugs du Projet

## 🔴 CRITIQUE - Haute Priorité

### 1. Mots de Passe en Clair dans la Requête de Login

**Fichier:** [routes/auth.js](routes/auth.js)

**Sévérité:** CRITIQUE

**Description:**
Le login compare les mots de passe en clair dans la requête SQL au lieu d'utiliser bcrypt pour la comparaison. Les mots de passe sont hashés lors de l'inscription mais pas vérifiés correctement lors de la connexion.

**Impact:**

- Authentification complètement cassée
- Les utilisateurs ne peuvent pas se connecter normalement
- Sécurité compromise

**Solution:**
Récupérer l'utilisateur par son username puis comparer le mot de passe avec bcrypt.

---

## 🟠 IMPORTANT - Haute Priorité

### 1. Implémenter un Système de Rôles

**Statut:** CONTRÔLE D'ACCÈS FAIBLE

**Fichier:** [routes/products.js](routes/products.js)

**Problème:**
Tous les utilisateurs connectés peuvent ajouter, modifier et supprimer des produits.

**Solution:**
Ajouter un champ role dans la table users, un middleware pour vérifier le rôle admin et l'appliquer aux routes sensibles.

---

### 2. Lien cassé – Bouton « Créer un compte »

**Fichier:** [views/login.ejs](views/login.ejs)

**Sévérité:** IMPORTANT

**Description:**
Le bouton « Créer un compte » sur la page de login ne fonctionne pas correctement. Le lien est cassé ou pointe vers une mauvaise destination.

**Impact:**

- Les nouveaux utilisateurs ne peuvent pas accéder à la page d'inscription
- Expérience utilisateur dégradée
- Perte potentielle de nouveaux utilisateurs

**Solution:**
Vérifier et corriger le lien du bouton pour qu'il pointe correctement vers `/register`.
