/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Custom command to ... add your description here
         * @example cy.clickOnMyJourneyInCandidateCabinet()
         */

        changeLang(lang: string): Chainable<null>;
        PerformLogin(login: string, lang: string): Chainable<null>;
        PerformLogout(): Chainable<null>;
        GoToPage(page: string): Chainable<null>;
        addNewUser(login: string, firstname: string, lastname: string, lang: string): Chainable<null>;
        modifyExistingUser(login: string, firstname: string, lastname: string, lang: string): Chainable<null>;
        deleteExistingUser(login: string, lang: string): Chainable<null>;
        addNewProject(name: string, businessLineName: string, teamName: string, description: string, lang: string): Chainable<null>;
        updateProject(id: string, name: string, businessLineName: string, teamName: string, description: string, lang: string): Chainable<null>;
        deleteProject(id: string, lang: string): Chainable<null>;
        addNewBusinessLine(name: string, lang: string): Chainable<null>;
        modifyExistingBusinessLine(previousName: string, newName:string, lang: string): Chainable<null>;
        deleteExistingBusinessLine(lang: string): Chainable<null>;
        addNewReadinessLevel(): Chainable<null>;
    }
}