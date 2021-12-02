// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "@testing-library/cypress/add-commands";

Cypress.Commands.add("createList", (name, addresses) => {
  cy.visit("/lists/new");
  cy.get("input#name").type(name);
  cy.get("button").click();
  if (Boolean(addresses)) {
    addresses.forEach(({ value, testnet }) => {
      const networkToggle = cy.get("input#network");
      if (testnet) {
        networkToggle.uncheck();
      } else {
        networkToggle.check();
      }
      cy.get("input#address").type(value);
      cy.get("button").contains("Add").click();
      cy.contains(value).should('be.visible')
    });
  }
});
