const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    apiUrl: "http://localhost:8081",
  },
  e2e: {
    setupNodeEvents(on, config) {
    
    },
    baseUrl: "http://localhost:8080/",
    reporter: "spec", // Utilisation du reporter spec
  },
});




