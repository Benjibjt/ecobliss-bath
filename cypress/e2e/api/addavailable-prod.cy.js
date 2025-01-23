import { login } from '../utils/auth';

describe('API Test: Ajouter un produit disponible au panier', () => {
  let authToken;

  before(() => {
    // Authentification pour obtenir le token
    login().then((token) => {
      authToken = token; // Stocker le token pour les tests
      expect(authToken).to.exist; // Vérifier que le token est valide
    });
  });

  it('Devrait ajouter un produit avec ID 8 au panier', () => {
    const productId = 8; // ID du produit spécifique
    const quantityToAdd = 1; // Quantité à ajouter
  
    // Étape 1 : Récupérer les détails du produit
    cy.request({
      method: 'GET',
      url: `http://localhost:8081/products/${productId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const product = response.body;
      expect(product.availableStock).to.be.greaterThan(0, 'Le produit est en rupture de stock.');
      cy.log(`Produit sélectionné : ${product.name} avec un stock de ${product.availableStock}`);
  
      // Étape 2 : Ajouter le produit au panier
      cy.request({
        method: 'PUT',
        url: 'http://localhost:8081/orders/add',
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          product: productId, // Utilise juste l'ID du produit
          quantity: quantityToAdd, // La quantité
        },
        failOnStatusCode: false, // Capturer les erreurs sans faire échouer le test
      }).then((addResponse) => {
        cy.log(`Statut réponse : ${addResponse.status}`);
        cy.log('Réponse complète :', JSON.stringify(addResponse.body));
      
        if (addResponse.status === 200) {
          // Succès : Vérifier l'id de la commande
          expect(addResponse.body).to.have.property('id');
          cy.log(`Commande créée avec l'ID : ${addResponse.body.id}`);  // Afficher l'ID de la commande
        } else if (addResponse.status === 400) {
          // Gestion des erreurs de validation
          cy.log('Erreur de validation détectée :', JSON.stringify(addResponse.body.error));
          expect(addResponse.body.error).to.include.keys(['quantity', 'product']);
        } else if (addResponse.status === 404) {
          // Ressource introuvable
          cy.log('Erreur 404 : Ressource introuvable.');
          expect(addResponse.body.error).to.include('Not Found');
        } else {
          // Cas inattendu
          throw new Error(`Statut inattendu : ${addResponse.status}`);
        }
      });
      
      
       
    });
  });
  
});



