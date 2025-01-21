describe('Smoke Test - Connexion', () => {
    it('Vérifie la présence des champs et du bouton de connexion', () => {
      // Accéder à la page de connexion
      cy.visit('http://localhost:8080/#/login');
      
      // Vérifier la présence du champ email
      cy.get('input[data-cy="login-input-username"]', { timeout: 10000 }).should('exist').and('be.visible');;
      
      // Vérifier la présence du champ mot de passe
      cy.get('input[data-cy="login-input-password"]').should('exist').and('be.visible');;
      
      // Vérifier la présence du bouton de connexion
      cy.get('button[data-cy="login-submit"]').should('exist').and('be.visible');
      
      // Vérification de la présence d'un lien pour mot de passe oublié (si applicable)
      cy.get('a[href="#/register"]').should('exist').and('be.visible');
    });
  });