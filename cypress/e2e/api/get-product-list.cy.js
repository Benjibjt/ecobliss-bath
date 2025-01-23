import { login } from '../utils/auth';

describe('API Test : requête de la liste des produits du panier', () => {
  let authToken;

  before(() => {
    login().then((token) => {
      authToken = token;
    });
  });

  it('Devrait retourner la liste des produits dans le panier', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      cy.log(JSON.stringify(response.body)); // Journaliser la réponse
    });
  });
});