import { login } from '../utils/auth';

describe('Test4: Panier - Gestion des produits et vérifications', () => {
  let authToken;
  let productId;
  let initialStock;
  const quantityToAdd = 1;
  let orderId;

  before(() => {
    // Authentification pour obtenir le token
    login().then((token) => {
      authToken = token;
      expect(authToken).to.exist; // Vérification du token
    });

    // Récupérer un produit aléatoire avec stock disponible via l'URL /products/random
    cy.request('GET', 'http://localhost:8081/products/random').then((response) => {
      cy.log('Réponse de /products/random :', JSON.stringify(response.body));

      // Vérifier que la réponse contient bien un tableau
      expect(response.status).to.eq(200);
      const randomProduct = response.body[0]; // Accéder au premier produit du tableau
      expect(randomProduct).to.have.property('id'); // Vérifier que l'id du produit existe

      productId = randomProduct.id;
      expect(productId).to.exist;
      expect(randomProduct.availableStock).to.be.greaterThan(0); // Vérifier que le stock est disponible
      cy.log('Produit sélectionné :', JSON.stringify(randomProduct));
    });
  });

  it('Devrait gérer l’ajout au panier et vérifier les limites', () => {
    // Vérification du stock initial via l'API
    cy.request({
      method: 'GET',
      url: `http://localhost:8081/products/${productId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      initialStock = response.body.availableStock;
      cy.log(`Stock initial du produit : ${initialStock}`);
      expect(initialStock).to.be.greaterThan(0); // Vérifier qu'il y a du stock
    });

    // Faire une requête PUT pour ajouter le produit au panier
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/orders/add',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        product: productId, // Utiliser "product" au lieu de "productId"
        quantity: quantityToAdd, // Vérifier que la quantité est bien renseignée
      },
    }).then((response) => {
      cy.log('Réponse de l’ajout au panier :', JSON.stringify(response.body));

      // Examiner la réponse complète pour comprendre sa structure
      expect(response.status).to.eq(200); // Vérification de la réponse 200

      // Vérifie si l'API retourne une propriété "id" pour l'ID de commande
      expect(response.body).to.have.property('id'); // ID de la commande
      orderId = response.body.id;
      cy.log(`ID de la commande ajouté : ${orderId}`);
    });

    // Vérifier que le produit est bien ajouté au panier en faisant une nouvelle requête pour récupérer les commandes
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      // Loggue la réponse complète pour examiner sa structure
      cy.log('Réponse complète API /orders :', JSON.stringify(response.body));
      expect(response.status).to.eq(200);

      // Vérification de la structure de response.body
      if (Array.isArray(response.body)) {
        // Si response.body est un tableau, on peut utiliser find()
        const foundOrder = response.body.find(order => order.id === orderId);
        if (foundOrder) {
          cy.log('Commande trouvée :', JSON.stringify(foundOrder));
          // Vérification que l'orderLines contient bien le produit ajouté
          expect(foundOrder.orderLines).to.deep.include({
            product: { id: productId },
            quantity: quantityToAdd,
          });
        } else {
          // Si la commande n'est pas trouvée
          cy.log('La commande n’a pas été trouvée ou le panier est vide.');
          throw new Error('La commande n’a pas été trouvée ou le panier est vide.');
        }
      } else {
        // Si response.body n'est pas un tableau, examiner sa structure autrement
        cy.log('La réponse n\'est pas un tableau. Contenu de response.body :', JSON.stringify(response.body));
      }
    });

    // Vérification du stock mis à jour après l'ajout au panier
    cy.request({
      method: 'GET',
      url: `http://localhost:8081/products/${productId}`,
    }).then((response) => {
      const updatedStock = response.body.availableStock;
      expect(updatedStock).to.eq(initialStock - quantityToAdd);
      cy.log(`Stock mis à jour du produit : ${updatedStock}`);
    });
  });
});













