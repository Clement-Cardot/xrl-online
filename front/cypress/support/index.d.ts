/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Custom command to ... add your description here
         * @example cy.clickOnMyJourneyInCandidateCabinet()
         */
        resetCollection(collection: string): Chainable<null>;
        addOneToCollection(collection: string, data: any): Chainable<null>;
        addManyToCollection(collection: string, data: any): Chainable<null>;
        changeLang(lang: string): Chainable<null>;
        PerformLogin(login: string, lang: string): Chainable<null>;
        PerformLogout(): Chainable<null>;
        GoToPage(page: string): Chainable<null>;
        addNewUser(login: string, firstname: string, lastname: string, lang: string): Chainable<null>;
        modifyExistingUser(login: string, firstname: string, lastname: string, lang: string): Chainable<null>;
        deleteExistingUser(login: string, lang: string): Chainable<null>;
    }
}