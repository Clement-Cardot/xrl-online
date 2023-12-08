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
  cy.get('#loginBtn > .mdc-button__label').click();

  // Intercept api call
  cy.intercept({
    method: 'GET',
    url: `/api/users/login?login=${login}`,
  }).as('apiLogin')

  // Connect as an admin
  cy.get('#mat-input-login').click({force: true});
  cy.get('#mat-input-login').type(login);
  cy.get('#loginSubmitBtn > .mdc-button__label').click();

  // Check api response
  cy.wait('@apiLogin').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.all.keys(
        'id',
        'login',
        'firstName',
        'lastName'
      );
    } else {
      throw new Error('interception.response is undefined');
    }
  });

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
  if (lang === 'en')
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Welcome back ${login} !\n`);
  else
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
  switch (page) {
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
    url: '/api/users/create-user',
  }).as('apiCreateUser');

  // Create new user
  cy.get('#addUserBtn').click();
  cy.get('#firstName-input').type(firstname);
  cy.get('#lastName-input').type(lastname);
  cy.get('#login-input').type(login);
  cy.get('#confirm').click();

  // Check api response
  cy.wait('@apiCreateUser').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.all.keys(
        'id',
        'login',
        'firstName',
        'lastName'
      );
    } else {
      throw new Error('interception.response is undefined');
    }
  });

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
    'be.visible'
  );
  if (lang === 'en')
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
      'have.text',
      ` User created\n`
    );
  else
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
      'have.text',
      ` Utilisateur créé\n`
    );

  // Force Snack bar to disappear (performance)
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
}
);

Cypress.Commands.add('modifyExistingUser', (previousLogin: string, newLogin: string, newFirstname: string, newLastname: string, lang: string = 'fr') => {
  // Intercept api call
  cy.intercept({
    method: 'PUT',
    url: '/api/users/update-user',
  }).as('apiModifyUser')

  // Trigger mouseenter event to display actions buttons
  cy.get('#list-users-actions-' + previousLogin).trigger('mouseenter', { force: true });

  // Click on modify button
  cy.get('#modify-'+previousLogin).click();

  // Clear input of Modify user dialog
  cy.get('#firstName-input').clear();
  cy.get('#lastName-input').clear();
  cy.get('#login-input').clear();

  // Enter new values (test2_user...)
  cy.get('#firstName-input').type(newFirstname);
  cy.get('#lastName-input').type(newLastname);
  cy.get('#login-input').type(newLogin);

  // Click on save button
  cy.get('#confirm').click();

  // Check api response
  cy.wait('@apiModifyUser').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.all.keys(
        'id',
        'login',
        'firstName',
        'lastName'
      );

      // Check if values have been modified
      expect(interception.response.body).to.have.property('login', newLogin)
      expect(interception.response.body).to.have.property('firstName', newFirstname)
      expect(interception.response.body).to.have.property('lastName', newLastname)
    } else {
      throw new Error('interception.response is undefined')
    }
  })

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
    'be.visible'
  );
  if (lang === 'en')
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
      'have.text',
      ` User updated\n`
    );
  else
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
      'have.text',
      ` Utilisateur mis à jour\n`
    );

  // Force Snack bar to disappear (performance)
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
}
);

Cypress.Commands.add('deleteExistingUser', (login: string, lang: string = 'fr') => {
  // Intercept api call
  cy.intercept({
    method: 'DELETE',
    url: '/api/users/delete-user*',
  }).as('apiDeleteUser')

  // Trigger mouseenter event to display actions buttons
  cy.get('#list-users-actions-' + login).trigger('mouseenter', { force: true });

  // Click on delete button
  cy.get('#delete-'+login).click();

  // Click on "Yes" button
  cy.get('#confirm').click();

  // Check api response
  cy.wait('@apiDeleteUser').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200);
    } else {
      throw new Error('interception.response is undefined');
    }
  });

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
    'be.visible'
  );
  if (lang === 'en')
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
      'have.text',
      ` User deleted\n`
    );
  else
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should(
      'have.text',
      ` Utilisateur supprimé\n`
    );

  // Force Snack bar to disappear (performance)
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();

  // Check if user has been deleted from list
  cy.get('#list-users-actions-'+login).should('not.exist');
});

Cypress.Commands.add('addNewProject', (name: string, teamName: string, businessLineName: string, description: string, lang: string = 'fr') => {
    // Intercept api call
    cy.intercept({
        method: 'POST',
        url: '/api/projects/create-project',
    }).as('apiCreateProject');

    /* Create new Project */
    cy.get('.add-container > button').click();
    cy.get('#project-name-input').clear();
    cy.get('#project-name-input').type(name);
    cy.get('#team-name-input').clear();
    cy.get('#team-name-input').type(teamName);
    cy.get('#business-line-name-input').click({force: true});
    cy.get('#business-line-name-input').clear();
    cy.get('#business-line-name-input').type(businessLineName);
    cy.get('#description-input').click({force: true});
    cy.get('#description-input').clear();
    cy.get('#description-input').type(description);
    cy.get('#confirm').click();

    // Check api response
    cy.wait('@apiCreateProject').then((interception) => {
        if (interception.response) {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body).to.have.all.keys('id', 'name', 'team', 'businessLine', 'description', 'assessments')

            // Check SnackBar
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Le projet a été créé avec succès\n');

            // Force Snack bar to disappear (performance)
            cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();

            cy.wrap(interception.response.body.id)
        } else {
            throw new Error('interception.response is undefined')
        }
    })
});

Cypress.Commands.add('updateProject', (id: string, name: string, teamName: string, businessLineName: string, description: string, lang: string = 'fr') => {
  // Intercept api call
  cy.intercept({
    method: 'PUT',
    url: '/api/projects/update-project',
  }).as('apiUpdateProject');

  /* Update new Project */
  cy.get('#project-card-'+id+' > .card > .front > .content > .card-header > .project-actions-buttons > #modify').click({ force: true });
  cy.wait(100)
  cy.get('#project-name-input').focus().clear();
  cy.get('#project-name-input').type(name);
  cy.get('#team-name-input').focus().clear();
  cy.get('#team-name-input').type(teamName);
  cy.get('#business-line-name-input').click({force: true});
  cy.get('#business-line-name-input').focus().clear();
  cy.get('#business-line-name-input').type(businessLineName);
  cy.get('#description-input').click({force: true});
  cy.get('#description-input').focus().clear();
  cy.get('#description-input').type(description);
  cy.get('#confirm').click();

  // Check api response
  cy.wait('@apiUpdateProject').then((interception) => {
    if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.all.keys('id', 'name', 'team', 'businessLine', 'description', 'assessments');
    } else {
        throw new Error('interception.response is undefined');
    }
  })

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Le projet a été mis à jour avec succès\n');

  // Force Snack bar to disappear (performance)
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('deleteProject', (id: string, lang: string = 'fr') => {
  // Intercept api call
  cy.intercept({
    method: 'DELETE',
    url: '/api/projects/delete-project?id='+id,
  }).as('apiDeleteProject');

  /* Delete a Project */
  cy.get('#project-card-'+id + ' > .card > .front > .content > .card-header > .project-actions-buttons > #delete').click({ force: true });
  cy.get('#confirm').click();

  // Check api response
  cy.wait('@apiDeleteProject').then((interception) => {
    if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
    } else {
        throw new Error('interception.response is undefined');
    }
  })

  // Check Project has been deleted
  cy.get('#project-card-'+id).should('not.exist');

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Le projet a été supprimé avec succès\n');

  // Force Snack bar to disappear
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('addNewBusinessLine', (name: string, lang: string = 'fr') => {
  // Intercept api call
  cy.intercept({
    method: 'POST',
    url: '/api/businessLines/create-businessLine',
  }).as('apiCreateBusinessLine')

  // Create new businessline
  cy.get('.add-container > .mdc-button > .mdc-button__label').click();
  cy.get('#businessLineName-input').clear();
  cy.get('#businessLineName-input').type(name);
  cy.get('#confirm').click();

  // Check api response
  cy.wait('@apiCreateBusinessLine').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body).to.have.all.keys('id', 'name')
    } else {
      throw new Error('interception.response is undefined')
    }
  })

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
  if (lang === 'en')
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Business line created\n`);
  else
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Secteur d'activité créé\n`);

  // Force Snack bar to disappear (performance)
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('modifyExistingBusinessLine', (businessLineId: string, newName: string, lang: string = 'fr') => {
  // Intercept api call
  cy.intercept({
    method: 'PUT',
    url: '/api/businessLines/update-businessLine',
  }).as('apiModifyBusinessLine')

  // Update businessline
  cy.get('#business-line-card-'+businessLineId+' > mat-card-header > .icons-container > #modify').click({ force: true });
  cy.get('#businessLineName-input').clear();
  cy.get('#businessLineName-input').type(newName);
  cy.get('#confirm').click();

  // Check updated Business Line name
  cy.get('#business-line-card-'+businessLineId+' > mat-card-header > .title-container > mat-card-title').should('have.text', 'New Name');

  // Check api response
  cy.wait('@apiModifyBusinessLine').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body).to.have.all.keys('id', 'name')

      // Check if values have been modified
      expect(interception.response.body).to.have.property('name', newName)
    } else {
      throw new Error('interception.response is undefined')
    }
  })

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
  if (lang === 'en')
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Business line updated\n');
  else
    cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Secteur d\'activité mis à jour\n');

  // Force Snack bar to disappear (performance)
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

Cypress.Commands.add('deleteExistingBusinessLine', (businessLineId: string, lang: string = 'fr') => {
  // Intercept api call
  cy.intercept({
    method: 'DELETE',
    url: '/api/businessLines/delete-businessLine?id='+businessLineId,
  }).as('apiDeleteBusinessLine')

  // Delete businessline
  cy.get('#business-line-card-'+businessLineId+' > mat-card-header > .icons-container > #delete').click({ force: true });
  cy.get('#confirm').click();

  // Check api response
  cy.wait('@apiDeleteBusinessLine').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200);
    } else {
      throw new Error('interception.response is undefined');
    }
  })

  // Check SnackBar
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
  cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Le secteur d\'activité a été supprimé avec succès\n');

  // Force Snack bar to disappear
  cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
});

