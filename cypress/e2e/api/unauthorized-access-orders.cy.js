describe('API Test: Accès non autorisé', () => {
    it('Devrait retourner une erreur 403 pour un utilisateur non connecté', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders',
        failOnStatusCode: false, // Permet de capturer les erreurs HTTP
      }).then((response) => {
        expect(response.status).to.eq(403); // Vérifie que le code HTTP est 403
      });
    });
  });