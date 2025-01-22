describe('API Test: Détails d’un produit', () => {
    it('Devrait retourner les détails du produit avec un ID spécifique', () => {
      cy.request('GET', 'http://localhost:8081/products/4').then((response) => {
        expect(response.status).to.eq(200); // Vérifie la réussite
        expect(response.body).to.have.property('id', 4); // Vérifie l’ID
        expect(response.body).to.have.property('name'); // Vérifie la présence d’un nom
        expect(response.body).to.have.property('price'); // Vérifie le prix
      });
    });
  });