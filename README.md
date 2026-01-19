# 🛒 Mini Site Web - Node.js/Express/MySQL

Site web de gestion de produits développé avec Node.js, Express et MySQL.

## 📦 Installation

### Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**
   
   Créer un fichier `.env` à la racine du projet :
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe_mysql
   DB_NAME=mini_site_db
   ```

3. **Configurer la base de données**
   
   Importer le script SQL :
   ```bash
   mysql -u root -p < database/init.sql
   ```
   
   Ou via MySQL Workbench / phpMyAdmin, exécuter le contenu du fichier `database/init.sql`

4. **Lancer le serveur**
   ```bash
   npm start
   ```
   
   Ou en mode développement :
   ```bash
   npm run dev
   ```

5. **Accéder au site**
   
   Ouvrir un navigateur : `http://localhost:3000`

## 👤 Comptes de Test

| Nom d'utilisateur | Mot de passe |
|-------------------|--------------|
| admin             | admin123     |
| user              | user123      |
| test              | test123      |

Vous pouvez créer un nouveau compte via `/auth/register`

1. **Utiliser des requêtes préparées** partout
2. **Hasher les mots de passe** avec bcrypt
3. **Déplacer les credentials** dans des variables d'environnement (.env)
4. **Utiliser un secret fort** pour les sessions
5. **Activer HTTPS** et les cookies sécurisés
6. **Valider toutes les entrées** utilisateur
7. **Implémenter un système de rôles** (RBAC)
8. **Ajouter des logs de sécurité**
9. **Corriger le bug** de conversion de prix

## 📄 Licence

Ce projet est à des fins éducatives uniquement.

## 👨‍💻 Auteur

Projet de démonstration - 2026

---

**Rappel**: Ce code contient des vulnérabilités intentionnelles. Ne jamais utiliser en production!
