import { login } from '../utils/auth';

describe('Test2: Connexion et vérification du bouton panier', () => {
  it('Devrait permettre de se connecter et afficher le bouton panier', () => {
    // Accéder à la page principale
    cy.visit('http://localhost:8080');

    // Cliquer sur le bouton Connexion
    cy.get('a[data-cy="nav-link-login"]').click(); // Bouton de connexion

    // Vérifier que la page de connexion est atteinte
    cy.url().should('include', '/login');

    // Remplir le formulaire de connexion
    cy.get('input[data-cy="login-input-username"]').type('test2@test.fr'); // Champ email
    cy.get('input[data-cy="login-input-password"]').type('testtest'); // Champ mot de passe
    cy.get('button[data-cy="login-submit"]').click(); // Soumettre le formulaire

    // Vérifier que l’utilisateur est connecté via le token
    login().then((token) => {
      expect(token).to.exist; // Vérifie que le token est généré
      cy.log('Token généré après connexion :', token);
    });

    // Vérifier que le bouton panier est visible
    cy.get('a[data-cy="nav-link-cart"]').should('be.visible').and('contain', 'Mon panier');
  });
});
