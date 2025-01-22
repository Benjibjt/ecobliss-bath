import { login } from '../utils/auth';

describe('API Test: Ajouter un produit au panier', () => {
  let authToken;

  before(() => {
    // Authentification pour obtenir le token via auth.js
    login().then((token) => {
      authToken = token; // Stocker le token pour les tests
      expect(authToken).to.exist; // Vérifier que le token est valide
    });
  });

  it('Devrait ajouter un produit aléatoire au panier', () => {
    // Étape 1 : Récupérer un produit aléatoire avec du stock
    cy.request('GET', 'http://localhost:8081/products/random').then((response) => {
      const validProducts = response.body.filter((p) => p.availableStock > 0); // Produits avec stock disponible
      expect(validProducts.length).to.be.greaterThan(0, 'Aucun produit disponible.');
      
      const randomProduct = validProducts[Math.floor(Math.random() * validProducts.length)];
      const productId = randomProduct.id;

      // Étape 2 : Ajouter le produit au panier
      cy.request({
        method: 'PUT',
        url: 'http://localhost:8081/orders/add',
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          orderLines: [{ productId, quantity: 1 }],
        },
        failOnStatusCode: false, // Capturer les erreurs sans faire échouer le test
      }).then((addResponse) => {
        cy.log(`Statut réponse : ${addResponse.status}`);

        if (addResponse.status === 200) {
          // Vérifier le succès
          expect(addResponse.body).to.have.property('orderId'); // Vérifier l'ID de commande
          cy.log(`Commande créée avec l'ID : ${addResponse.body.orderId}`);
        } else if (addResponse.status === 400) {
          // Gérer les erreurs de validation
          cy.log('Erreur de validation détectée.');
          expect(addResponse.body.error).to.include.keys(['quantity', 'product']);
        } else if (addResponse.status === 404) {
          // Gérer les ressources introuvables
          cy.log('Erreur 404 : Ressource introuvable.');
          expect(addResponse.body.error).to.include('Not Found');
        } else {
          // Gérer les statuts inattendus
          throw new Error(`Statut inattendu : ${addResponse.status}`);
        }
      });
    });
  });

  it('Devrait échouer si l’authentification échoue', () => {
    login('wronguser@test.fr', 'wrongpassword', false).then((response) => {
      cy.log('Structure complète de la réponse :', JSON.stringify(response));
  
      expect(response.status).to.eq(401); // Vérifiez le statut
  
      // Validation conditionnelle de la structure
      if (response.body) {
        cy.log('Corps de la réponse trouvé.');
        if (response.body.error) {
          expect(response.body.error).to.include('Invalid credentials'); // Vérifiez le message d'erreur
        } else {
          cy.log('Le champ "error" est manquant dans le body.');
        }
      } else {
        cy.log('Le body de la réponse est vide.');
      }
    });
  });
});

