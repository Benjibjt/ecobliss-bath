# Projet : Automatisez des tests pour une boutique en ligne
Ce projet vise à automatiser les tests d'une boutique en ligne en utilisant Cypress. Il comprend des tests pour valider les fonctionnalités clés telles que la connexion, la gestion du panier, et l'accès sécurisé aux API.

## Description
Ce projet automatise les tests d'une boutique en ligne à l'aide de Cypress. Il valide les fonctionnalités essentielles telles que la gestion des utilisateurs, le panier et les API associées.

### Prérequis
- Docker (assurez-vous qu'il est installé et configuré).
- Node.js et npm.

## Installation du projet

1. Clonez ou téléchargez le dépôt du projet.
2. Assurez-vous que [Docker](https://www.docker.com/) est installé.
3. Lancez la commande suivante dans le terminal ouvert dans le dossier du projet : `sudo docker-compose up --build`
4. Ouvrez le site depuis la page http://localhost:8080 

Nb : à l'étape 3, ne pas ajouter le `sudo` si vous êtes sous Windows (sauf dernière version de Windows 11) (PowerShell ou Shell) : sudo n'existant pas et Docker Desktop configurant automatiquement Docker pour ne pas avoir besoin des droits administrateur.

# Installation et Lancement de Cypress

## Installation
1. Assurez-vous que Node.js est installé sur votre système. Si ce n'est pas le cas, téléchargez-le depuis [Node.js](https://nodejs.org/).
2. Installez Cypress via npm : `npm install cypress --save-dev`

## Lancement de Cypress
Ouvrez Cypress pour exécuter les tests via l'interface utilisateur : `npx cypress open`

## Lancement de Cypress en mode headless 
Pour lancer Cypress en mode headless (sans interface graphique) : `npx cypress run`


# Structure du projet
- cypress/e2e/ : Contient les fichiers de tests automatisés.
- cypress/fixtures/ : Données utilisées pour simuler des scénarios de test.
- cypress/reports/ : Dossier où les rapports de tests sont générés.

# Tests implémentés
Les tests couvrent les scénarios suivants :
- Connexion utilisateur : Validation des champs et gestion des erreurs.
- Gestion du panier : Ajout de produits, vérification des stocks et validation des limites.
- Accès sécurisé : Tests d'autorisation pour les API.
- Détails produits : Vérification de la structure des réponses API.


# Remerciements
Un grand merci à tous les contributeurs et collègues qui ont participé à la réalisation de ce projet.



