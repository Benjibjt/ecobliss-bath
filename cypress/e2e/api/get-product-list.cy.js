import { login } from '../utils/auth';

describe('API Tests protégés', () => {
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