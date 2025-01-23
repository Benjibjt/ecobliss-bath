describe('Smoke Test - Champ de disponibilité du produit', () => {
    let productId;
  
    before(() => {
      // Récupérer un produit existant avec du stock
      cy.request('GET', 'http://localhost:8081/products/random').then((response) => {
        const validProducts = response.body.filter((product) => product.availableStock > 0);
        expect(validProducts.length).to.be.greaterThan(0, 'Aucun produit valide trouvé.');
        productId = validProducts[0].id; // Prend le premier produit valide
        cy.log(`Produit sélectionné : ID ${productId}`);
      });
    });
  
    it('Vérifie la présence du champ de disponibilité du produit', () => {
      // Accéder dynamiquement à la page du produit
      cy.visit(`http://localhost:8080/#/products/${productId}`);
      
      // Vérifier que le paragraphe avec la classe "stock" est présent et visible
      cy.get('p.stock')
        .should('exist')
        .and('be.visible')
        .and('contain', 'en stock'); // Vérifie également que le texte correspond
    });
  });