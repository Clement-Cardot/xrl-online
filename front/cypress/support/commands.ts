/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('resetCollection', (collection: string) => {
    const options = {
        database: 'xrlonline',
        collection: collection
    };
    cy.deleteMany({}, options);
});

Cypress.Commands.add('addOneToCollection', (collection: string, data: any) => {
        const options = {
            database: 'xrlonline',
            collection: collection
        };
        cy.insertOne(data, options);
});

Cypress.Commands.add('addManyToCollection', (collection: string, data: any) => {
        const options = {
            database: 'xrlonline',
            collection: collection
        };
        cy.insertMany(data, options);
});

Cypress.Commands.add('changeLang', (lang: string) => {
    // switch language (1 -> french, 2 -> english, ...)
    cy.get('#language-button > .mat-mdc-button-touch-target').click();
    switch (lang) {
        case 'fr':
            cy.get(':nth-child(1) > .mat-mdc-menu-item-text').click();
            break;
        case 'en':
            cy.get(':nth-child(2) > .mat-mdc-menu-item-text').click();
            break;
        default:
            cy.get(':nth-child(1) > .mat-mdc-menu-item-text').click();
            break;
    }
    cy.get('.cdk-overlay-container').click(-50, -50, { force: true });
});

Cypress.Commands.add('PerformLogin', (login: string, lang: string = 'fr') => {
    // Open login dialog
    cy.get('.ng-star-inserted > .mdc-button > .mdc-button__label').click();

    // Intercept api call
    cy.intercept({
        method: 'GET',
        url: `http://localhost:8080/login?login=${login}`,
    }).as('apiLogin')

    // Connect as an admin
    cy.get('mat-label.ng-tns-c1205077789-4').click();
    cy.get('#mat-input-0').type(login);
    cy.get('#loginSubmitBtn > .mdc-button__label').click();

    // Check api response
    cy.wait('@apiLogin').then((interception) => {
        if (interception.response) {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body).to.have.all.keys('id', 'login', 'firstName', 'lastName')
        } else {
            throw new Error('interception.response is undefined')
        }
    })

    // Check SnackBar
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
    if (lang === 'en')
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Welcome back ${login} !\n`);  
    else
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Bienvenue ${login} !\n`);
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Bienvenue ${login} !\n`);

    // Force Snack bar to disappear (performance)
    cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('PerformLogout', () => {
    cy.get('#logoutBtn > .mdc-button__label').click();

    // Force Snack bar to disappear (performance)
    cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('GoToPage', (page: string) => {
    switch(page) {
        case 'home':
            cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').click();
            break;
        case 'projects':
            cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').click();
            break;
        case 'RL':
            cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').click();
            break;
        case 'admin-RL':
            cy.get('#barMenu > div > :nth-child(4) > .mdc-button__label').click();
            cy.get('.mat-mdc-menu-content > :nth-child(1)').click();
            break;
        case 'admin-teams':
            cy.get('#barMenu > div > :nth-child(4) > .mdc-button__label').click();
            cy.get('.mat-mdc-menu-content > :nth-child(2)').click();
            break;
        case 'admin-BL':
            cy.get('#barMenu > div > :nth-child(4) > .mdc-button__label').click();
            cy.get('.mat-mdc-menu-content > :nth-child(3)').click();
            break;
        default:
            break;
    }
});

Cypress.Commands.add('addNewUser', (login: string, firstname: string, lastname: string, lang: string = 'fr') => {
    // Intercept api call
    cy.intercept({
        method: 'POST',
        url: 'http://localhost:8080/create-user',
    }).as('apiCreateUser')

    // Create new user
    cy.get('#addUserBtn').click();
    cy.get('#mat-input-2').type(firstname);
    cy.get('#mat-input-3').type(lastname);
    cy.get('#mat-input-4').type(login);
    cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

    // Check api response
    cy.wait('@apiCreateUser').then((interception) => {
        if (interception.response) {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body).to.have.all.keys('id', 'login', 'firstName', 'lastName')
        } else {
            throw new Error('interception.response is undefined')
        }
    })

    // Check SnackBar
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
    if (lang === 'en')
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` User created\n`);  
    else
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Utilisateur créé\n`);

    // Force Snack bar to disappear (performance)
    cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('modifyExistingUser', (previousLogin: string, newLogin: string, newFirstname: string, newLastname: string, lang: string = 'fr') => {
    // Intercept api call
    cy.intercept({
        method: 'PUT',
        url: 'http://localhost:8080/update-user',
    }).as('apiModifyUser')

    // Trigger mouseenter event to display actions buttons
    cy.get('#list-users-actions-test_user').trigger('mouseenter', {force: true});

    // Click on modify button
    cy.get('#list-users-actions-test_user > :nth-child(1) > .mat-icon').click();

    // Clear input of Modify user dialog
    cy.get('#mat-input-2').clear();
    cy.get('#mat-input-3').clear();
    cy.get('#mat-input-4').clear();

    // Enter new values (test2_user...)
    cy.get('#mat-input-2').type('test2_user_firstname');
    cy.get('#mat-input-3').type('test2_user_lastname');
    cy.get('#mat-input-4').type('test2_user');

    // Click on save button
    cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

    // Check api response
    cy.wait('@apiModifyUser').then((interception) => {
        if (interception.response) {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body).to.have.all.keys('id', 'login', 'firstName', 'lastName')

            // Check if values have been modified
            expect(interception.response.body).to.have.property('login', 'test2_user')
            expect(interception.response.body).to.have.property('firstName', 'test2_user_firstname')
            expect(interception.response.body).to.have.property('lastName', 'test2_user_lastname')
        } else {
            throw new Error('interception.response is undefined')
        }
    })

    // Check SnackBar
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
    if (lang === 'en')
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` User updated\n`);  
    else
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Utilisateur mis à jour\n`);

    // Force Snack bar to disappear (performance)
    cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('deleteExistingUser', (login: string, lang: string = 'fr') => {
    // Intercept api call
    cy.intercept({
        method: 'DELETE',
        url: 'http://localhost:8080/delete-user*',
    }).as('apiDeleteUser')

    // Trigger mouseenter event to display actions buttons
    cy.get('#list-users-actions-test_user').trigger('mouseenter', {force: true});

    // Click on delete button
    cy.get('#list-users-actions-test_user > :nth-child(2) > .mat-icon').click();

    // Click on "Yes" button
    cy.get('[ng-reflect-dialog-result="true"] > .mdc-button__label').click();

    // Check api response
    cy.wait('@apiDeleteUser').then((interception) => {
    if (interception.response) {
        expect(interception.response.statusCode).to.eq(200)
    } else {
        throw new Error('interception.response is undefined')
    }
    })

    // Check SnackBar
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
    if (lang === 'en')
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` User deleted\n`);  
    else
        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Utilisateur supprimé\n`);

    // Force Snack bar to disappear (performance)
    cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();

    // Check if user has been deleted from list
    cy.get('#list-users-actions-test_user').should('not.exist');
});