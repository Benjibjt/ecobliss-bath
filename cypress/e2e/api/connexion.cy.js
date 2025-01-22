import { login } from '../utils/auth';

describe('API Test: Connexion', () => {

  let authToken;

  before(() => {
    // Authentification pour obtenir le token via auth.js
    login().then((token) => {
      authToken = token; // Stocker le token pour les tests
      expect(authToken).to.exist; // Vérifier que le token est valide
    });
  });

  it('Devrait réussir pour un utilisateur connu', () => {
    // Utilisation du token déjà récupéré pour tester l'utilisateur connu
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/me',  // Exemple d'API protégée
      headers: { Authorization: `Bearer ${authToken}` }, // Utilisation du token d'authentification
    }).then((response) => {
      cy.log(JSON.stringify(response)); // Affiche la réponse complète
      expect(response.status).to.eq(200); // Vérifie le code 200
      expect(response.body).to.have.property('username'); // Vérifie que le corps contient le nom d'utilisateur
    });
  });

  it('Devrait échouer pour un utilisateur inconnu', () => {
    // Tentative de connexion avec des identifiants incorrects
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: { username: 'fakeuser@test.fr', password: 'wrongpass' },
      failOnStatusCode: false, // Ne pas échouer le test en cas de statut 401
    }).then((response) => {
      cy.log(JSON.stringify(response)); // Affiche la réponse complète
      expect(response.status).to.eq(401); // Vérifie le code 401
    });
  });
});
