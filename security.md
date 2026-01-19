# Sécurité

## 🔴 CRITIQUE - Haute Priorité

### 1. Injection SQL dans le Login

**Fichier:** [routes/auth.js](routes/auth.js)

**Sévérité:** CRITIQUE

**Description:**
La requête SQL dans la fonction de login est vulnérable aux injections SQL. Les variables `username` et `password` sont directement concaténées dans la requête SQL sans préparation ni échappement.

**Impact:**

- Contournement de l'authentification avec `' OR '1'='1`
- Accès non autorisé à tous les comptes
- Extraction de données sensibles de la base de données
- Modification ou suppression de données

**Solution:**
Utiliser des requêtes préparées avec des paramètres placeholders

### 2. Absence de Régénération de Session Après Connexion

**Fichier:** [routes/auth.js](routes/auth.js)

**Sévérité:** MAJEURE

**Description:**
Lorsqu'un utilisateur se connecte avec succès, l'identifiant de session n'est pas renouvelé. Cette faille permet à un attaquant de réaliser une attaque par fixation de session.

**Impact:**

- Un attaquant peut forcer un utilisateur à utiliser un identifiant de session connu à l'avance
- L'attaquant peut ensuite réutiliser cet identifiant pour accéder au compte de la victime
- Compromission potentielle de l'authentification de l'utilisateur

**Solution:**
Appeler `req.session.regenerate()` immédiatement après une connexion réussie pour créer un nouvel identifiant de session.

## 🟠 MAJEUR - Priorité Moyenne

### 1. Implémenter une Politique de Mots de Passe Forte

**Fichier:** [routes/auth.js](routes/auth.js)

**Problème:**
Validation trop permissive (seulement 6 caractères minimum).

---

### 2. Messages d'erreur trop verbeux – Fuite d'informations

**Fichier:** [routes/auth.js](routes/auth.js)

**Sévérité:** MAJEURE

**Description:**
Les messages d'erreur révèlent trop d'informations sur le système. Par exemple, ils indiquent si un nom d'utilisateur existe ou non dans la base de données, ce qui peut aider un attaquant à énumérer les comptes valides.

**Impact:**

- Fuite d'informations sensibles sur la structure de la base de données
- Facilite les attaques par énumération d'utilisateurs
- Révèle des détails techniques qui peuvent aider un attaquant
- Violation des bonnes pratiques de sécurité

**Solution:**
Utiliser des messages d'erreur génériques qui ne révèlent pas si un utilisateur existe ou non (ex: "Identifiants incorrects" au lieu de "Utilisateur introuvable").

### 3. Activer HTTPS / Mettre en place une Content Security Policy (CSP)

**Fichier:** [server.js](server.js)

**Sévérité:** MAJEURE

**Description:**
L'application ne force pas l'utilisation de HTTPS et n'a pas de Content Security Policy (CSP) configurée. Cela expose l'application à des attaques man-in-the-middle et XSS.

**Impact:**

- Communications non chiffrées vulnérables aux interceptions
- Données sensibles (mots de passe, sessions) transmises en clair
- Absence de protection contre les attaques XSS
- Pas de contrôle sur les ressources chargées par le navigateur

**Solution:**

1. Forcer HTTPS en production avec des certificats SSL/TLS
2. Implémenter une CSP stricte pour contrôler les sources de contenu autorisées
3. Ajouter des headers de sécurité (HSTS, X-Content-Type-Options, etc.)

---

### 4. Implémenter une Politique de Mots de Passe Forte

**Fichier:** [routes/auth.js](routes/auth.js)

**Problème:**
Validation trop permissive (seulement 6 caractères minimum).

**Solution:**
Mettre en place une validation plus stricte des mots de passe, incluant :

- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial
