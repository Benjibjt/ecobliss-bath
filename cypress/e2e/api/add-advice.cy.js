import { login } from '../utils/auth';

describe('API Test: Ajouter un avis', () => {
  let authToken;

  before(() => {
    // Authentification pour obtenir le token
    login().then((token) => {
      authToken = token;
      expect(authToken).to.exist; // Vérification que le token est valide
    });
  });

  it('Devrait ajouter un avis avec succès', () => {
    const reviewPayload = {
      title: 'string',
      comment: 'string',
      rating: 5,
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: reviewPayload,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.include.keys('id', 'date', 'title', 'comment', 'rating', 'author');
      expect(response.body.title).to.eq(reviewPayload.title);
      expect(response.body.comment).to.eq(reviewPayload.comment);
    });
  });

  it('Devrait échouer si le titre dépasse la longueur maximale autorisée', () => {
    const longTitle = 'A'.repeat(101); // Titre de 101 caractères
    const reviewPayload = {
      title: longTitle,
      comment: 'Commentaire valide',
      rating: 5,
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: { Authorization: `Bearer ${authToken}` },
      body: reviewPayload,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.include('Title exceeds maximum length');
    });
  });

  it('Devrait échouer si le commentaire dépasse la longueur maximale autorisée', () => {
    const longComment = 'A'.repeat(1001); // Commentaire de 1001 caractères
    const reviewPayload = {
      title: 'Titre valide',
      comment: longComment,
      rating: 5,
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: { Authorization: `Bearer ${authToken}` },
      body: reviewPayload,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.include('Comment exceeds maximum length');
    });
  });

  it('Devrait échouer si le titre et le commentaire sont vides', () => {
    const reviewPayload = {
      title: '',
      comment: '',
      rating: 5,
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: { Authorization: `Bearer ${authToken}` },
      body: reviewPayload,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.include('Title and comment cannot be empty');
    });
  });
});






  