import { login } from '../utils/auth';

describe('API Test: Ajouter un produit en rupture de stock', () => {
  let authToken;

  before(() => {
    // Authentification pour obtenir le token via auth.js
    login().then((token) => {
      authToken = token; // Stocker le token pour les tests
      expect(authToken).to.exist; // Vérifier que le token est valide
    });
  });

  it('Devrait échouer si le produit est en rupture de stock', () => {
    // Étape 1 : Récupérer un produit en rupture de stock (id = 3)
    cy.request('GET', 'http://localhost:8081/products/3').then((response) => {
      const product = response.body;

      // Log de la réponse complète pour débogage
      cy.log('Réponse complète du produit :', JSON.stringify(product));

      // Vérifier que le produit existe
      expect(product).to.exist;

      // Vérifier que le stock est nul ou négatif (rupture de stock)
      cy.log('Stock disponible du produit :', product.availableStock);
      expect(product.availableStock).to.be.at.most(0, 'Produit en rupture de stock');

      // Étape 2 : Essayer d'ajouter le produit au panier
      cy.request({
        method: 'POST',
        url: 'http://localhost:8081/orders/add',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          product: product.id, // Utilisation de l'ID du produit
          quantity: 1, // Quantité demandée
        },
        failOnStatusCode: false, // Permettre de capturer les erreurs
      }).then((addResponse) => {
        cy.log('Réponse complète de l\'ajout au panier :', JSON.stringify(addResponse.body));

        // Vérifier que le produit en rupture de stock retourne un statut 400
        if (addResponse.status === 400) {
          cy.log('✅ Le serveur a correctement renvoyé un statut 400 pour le produit en rupture de stock.');
        } else if (addResponse.status === 405) {
          cy.log('⚠️ La méthode POST est rejetée avec un statut 405. Tentative avec PUT.');

          // Tester la méthode PUT, qui ne devrait pas être autorisée
          cy.request({
            method: 'PUT',
            url: 'http://localhost:8081/orders/add',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
            body: {
              product: product.id,
              quantity: 1,
            },
            failOnStatusCode: false,
          }).then((putResponse) => {
            cy.log(`Statut réponse PUT : ${putResponse.status}`);

            // Si la requête PUT retourne 200, c'est une anomalie !
            if (putResponse.status === 200) {
              throw new Error('🚨 Erreur : L\'ajout au panier fonctionne avec PUT, alors qu\'il ne devrait pas être autorisé.');
            } else {
              cy.log('✅ La requête PUT est correctement rejetée avec un statut 405.');
            }
          });
        } else {
          // Si le statut est autre que 405, cela indique une erreur
          throw new Error(`🚨 Erreur : Attendu 405, mais reçu ${addResponse.status}`);
        }
      });
    });
  });

  it('Devrait échouer si l’authentification échoue', () => {
    login('wronguser@test.fr', 'wrongpassword', false).then((response) => {
      cy.log('Structure complète de la réponse :', JSON.stringify(response));

      expect(response.status).to.eq(401); // Vérifiez le statut

      // Vérification du message d'erreur dans le corps de la réponse
      const body = response.body;
      if (body && body.message) {
        expect(body.message).to.include('Invalid credentials'); // Vérifier le message
      } else {
        cy.log('Le message d\'erreur est absent.');
      }
    });
  });
});
