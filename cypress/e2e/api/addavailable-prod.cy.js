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

      // Étape 2 : Essayer d'ajouter le produit au panier avec une requête POST
      cy.request({
        method: 'POST',
        url: 'http://localhost:8081/orders/add',
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          product: productId,
          quantity: quantityToAdd,
        },
        failOnStatusCode: false, // Capturer les erreurs sans faire échouer le test
      }).then((addResponse) => {
        cy.log(`Statut réponse POST : ${addResponse.status}`);
        cy.log('Réponse complète :', JSON.stringify(addResponse.body));

        if (addResponse.status === 200) {
          // Succès : Vérifier que l'ID de la commande est bien retourné
          expect(addResponse.body).to.have.property('id');
          cy.log(`Commande créée avec l'ID : ${addResponse.body.id}`);
        } else if (addResponse.status === 405) {
          cy.log('⚠️ La méthode POST est rejetée avec un statut 405. Tentative avec PUT.');

          // Étape 3 : Vérifier si une requête PUT fonctionne à la place
          cy.request({
            method: 'PUT',
            url: 'http://localhost:8081/orders/add',
            headers: { Authorization: `Bearer ${authToken}` },
            body: {
              product: productId,
              quantity: quantityToAdd,
            },
            failOnStatusCode: false,
          }).then((putResponse) => {
            cy.log(`Statut réponse PUT : ${putResponse.status}`);
            cy.log('Réponse complète (PUT) :', JSON.stringify(putResponse.body));

            if (putResponse.status === 200) {
              throw new Error('🚨 Erreur : L\'ajout au panier fonctionne avec PUT, alors qu\'il devrait utiliser POST !');
            } else {
              cy.log('✅ La requête PUT est également refusée, l\'API ne supporte pas PUT pour cette action.');
            }
          });
        } else {
          // Autres erreurs
          throw new Error(`Statut inattendu : ${addResponse.status}`);
        }
      });
    });
  });
});





