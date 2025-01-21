import { login } from '../utils/auth';

describe('Smoke Test - Panier après connexion', () => {
  let authToken;
  let productId;

  before(() => {
    // Étape 1 : Authentification
    login().then((token) => {
      authToken = token;
      expect(authToken).to.exist; // Vérifie que le token est valide
    });

    // Étape 2 : Sélectionner un produit valide
    cy.request('GET', 'http://localhost:8081/products/random').then((response) => {
      expect(response.status).to.eq(200); // Vérifie le succès de la requête
      const validProducts = response.body.filter((product) => product.availableStock > 0); // Produits avec du stock disponible
      expect(validProducts.length).to.be.greaterThan(0); // Vérifie qu’il y a des produits valides
      productId = validProducts[0].id; // Sélectionne le premier produit valide
      cy.log(`Produit sélectionné : ID ${productId}`);
    });
  });

  it('Vérifie la présence du bouton "Ajouter au panier"', () => {
    // Étape 3 : Charger la page produit
    cy.visit(`http://localhost:8080/#/products/${productId}`, {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('authToken', authToken); // Injecte le token
      },
    });

    // Vérifie la présence et la visibilité du bouton "Ajouter au panier"
    cy.get('button[data-cy="detail-product-add"]')
      .should('exist')
      .and('be.visible')
      .and('contain', 'Ajouter au panier');
  });
});