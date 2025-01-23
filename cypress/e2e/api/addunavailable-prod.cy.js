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

      // Vérifier que le stock est nul ou négatif
      cy.log('Stock disponible du produit :', product.availableStock);
      expect(product.availableStock).to.be.at.most(0, 'Produit en rupture de stock');

      // Étape 2 : Essayer d'ajouter le produit au panier
      cy.request({
        method: 'PUT',
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

        // Vérifier le statut HTTP
        expect(addResponse.status).to.eq(400, 'Statut attendu : 400');

        // Vérifier l'erreur retournée par l'API
        const error = addResponse.body.error;
        expect(error).to.exist;

        // Vérifier si l'ajout est autorisé malgré un stock insuffisant
        expect(addResponse.status).to.eq(200, 'Statut attendu : 200 (précommande possible)');
        if (addResponse.body.warning) {
        expect(addResponse.body.warning).to.include('Product is out of stock, added as a backorder');
        }


        if (typeof error === 'string') {
          cy.log('Erreur sous forme de chaîne :', error);
          expect(error).to.include('Out of stock');
        } else if (typeof error === 'object') {
          cy.log('Erreur sous forme d\'objet :', JSON.stringify(error));
          if (error.product) {
            expect(error.product).to.include('This value is not valid.');
          }
        } else {
          cy.log('Erreur structure inattendue :', JSON.stringify(error));
          throw new Error('Structure inattendue pour le champ error');
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

