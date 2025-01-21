export const login = (username = 'test2@test.fr', password = 'testtest', returnToken = true) => {
    return cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: { username, password },
      failOnStatusCode: false, // Capture les erreurs HTTP
    }).then((response) => {
      if (returnToken) {
        return response.body.token; // Retourne uniquement le token si spécifié
      }
      return response; // Retourne la réponse complète
    });
  };