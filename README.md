# Projet : Automatisez des tests pour une boutique en ligne
Ce projet vise à automatiser les tests d'une boutique en ligne en utilisant Cypress. Il comprend des tests pour valider les fonctionnalités clés telles que la connexion, la gestion du panier, et l'accès sécurisé aux API.

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

## Lancement des tests avec Cypress (interface graphique)
1. Depuis le terminal, lancez la commande suivante pour ouvrir l'interface graphique de Cypress : `npx cypress open`
2. Sélectionnez E2E Testing
3. Sélectionnez le navigateur souhaité dans l'interface (Chrome, Edge, etc.).
4. Cliquez sur le fichier de test que vous souhaitez exécuter dans la liste affichée.
5. Cliquez sur le bouton de lancement pour exécuter le test dans une fenêtre du navigateur.
6. Consultez les résultats en temps réel dans l'interface graphique.

## Générer un Rapport après l'exécution des Tests avec Cypress
1. Lancez tous les tests en mode headless (sans interface graphique) avec la commande suivante :`npx cypress run`
2. Les résultats des tests seront affichés directement dans le terminal après l'exécution.


# Structure du projet
- cypress/e2e/ : Contient les fichiers de tests automatisés.
- cypress/fixtures/ : Données utilisées pour simuler des scénarios de test.
- cypress/screenshots/ : Contient les screenshots des tests en échec.
- cypress/support/ : Dossier où sont centralisées les actions répétitives.

# Tests implémentés
Les tests couvrent les scénarios suivants :
- Connexion utilisateur : Validation des champs et gestion des erreurs.
- Gestion du panier : Ajout de produits, vérification des stocks et validation des limites.
- Accès sécurisé : Tests d'autorisation pour les API.
- Détails produits : Vérification de la structure des réponses API.


# Remerciements
Un grand merci à tous les contributeurs et collègues qui ont participé à la réalisation de ce projet.



