describe('Admin Team Page tests', () => {

    // TODO
    const usersTestData = [{login: 'admin', firstName: 'admin', lastName: 'admin'}, {login: 'test_user', firstName: 'test_user_firstname', lastName: 'test_user_lastname'}, {login: 'test_user3', firstName: 'test_user3_firstname', lastName: 'test_user3_lastname'}]

    beforeEach(() => {
        cy.resetCollection('users');
        cy.addManyToCollection('users', usersTestData)
    })

    beforeEach(() => {
      cy.visit('/');
      cy.PerformLogin('admin');
      cy.GoToPage('admin-teams')
    })
  
    context('US : XRLO-25 As an Admin, I must be able to create a new User', () => {

      it('Create a new User success', () => {
        cy.addNewUser('new_user_login', 'new_user_firstname', 'new_user_lastname')
      })

      it('Create a new User login already used', () => {
        // Intercept api call
        cy.intercept({
          method: 'POST',
          url: 'http://localhost:8080/create-user',
        }).as('apiCreateUser')

        // Create new user
        cy.get('#addUserBtn').click();
        cy.get('#mat-input-2').type(usersTestData[1].firstName);
        cy.get('#mat-input-3').type(usersTestData[1].lastName);
        cy.get('#mat-input-4').type(usersTestData[1].login);
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check api response
        cy.wait('@apiCreateUser').then((interception) => {
          if (interception.response) {
              expect(interception.response.statusCode).to.eq(409)
          } else {
              throw new Error('interception.response is undefined')
          }
        })

        // Check error message
        cy.get('#mat-mdc-error-3').should('have.text', 'Cet identifiant existe déjà');
        cy.get('#mat-mdc-error-3').should('be.visible');
      })

      it('Create a new User login null', () => {
        // Create new user
        cy.get('#addUserBtn').click();
        cy.get('#mat-input-2').type("Jean");
        cy.get('#mat-input-3').type("Durant");
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check error message
        cy.get('#mat-mdc-error-3').should('have.text', 'Un identifiant est requis');
        cy.get('#mat-mdc-error-3').should('be.visible');
      })

      it('Create a new User firstname null', () => {
        // Create new user
        cy.get('#addUserBtn').click();
        cy.get('#mat-input-3').type("Durant");
        cy.get('#mat-input-4').type("durantj");
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check error message
        cy.get('#mat-mdc-error-1').should('have.text', 'Un prénom est requis');
        cy.get('#mat-mdc-error-1').should('be.visible');
      })

      it('Create a new User lastname null', () => {
        // Create new user
        cy.get('#addUserBtn').click();
        cy.get('#mat-input-2').type("Jean");
        cy.get('#mat-input-4').type("durantj");
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check error message
        cy.get('#mat-mdc-error-2').should('have.text', 'Un nom est requis');
        cy.get('#mat-mdc-error-2').should('be.visible');
      })

    });

    context('US : XRLO-26 As an Admin, I could be able to modify an existing User', () => {

      it('Modify an existing User success', () => {
        cy.modifyExistingUser('test_user', 'test_user_modified', 'test_user_firstname_modified', 'test_user_lastname_modified')
      })

      it('Modify an existing User login already exists', () => {
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
        cy.get('#mat-input-4').type('test_user3');

        // Click on save button
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check api response
        cy.wait('@apiModifyUser').then((interception) => {
          if (interception.response) {
              expect(interception.response.statusCode).to.eq(409)
          } else {
              throw new Error('interception.response is undefined')
          }
        })

        // Check error message
        cy.get('#mat-mdc-error-3').should('have.text', 'Cet identifiant existe déjà');
        cy.get('#mat-mdc-error-3').should('be.visible');
      })

      it('Modify an existing User login null', () => {
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

        // Click on save button
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check error message
        cy.get('#mat-mdc-error-3').should('have.text', 'Un identifiant est requis');
        cy.get('#mat-mdc-error-3').should('be.visible');
      })

      it('Modify an existing User firstname null', () => {
        // Trigger mouseenter event to display actions buttons
        cy.get('#list-users-actions-test_user').trigger('mouseenter', {force: true});

        // Click on modify button
        cy.get('#list-users-actions-test_user > :nth-child(1) > .mat-icon').click();

        // Clear input of Modify user dialog
        cy.get('#mat-input-2').clear();
        cy.get('#mat-input-3').clear();
        cy.get('#mat-input-4').clear();

        // Enter new values (test2_user...)
        cy.get('#mat-input-3').type('test2_user_lastname');
        cy.get('#mat-input-4').type('test2_user');

        // Click on save button
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check error message
        cy.get('#mat-mdc-error-1').should('have.text', 'Un prénom est requis');
        cy.get('#mat-mdc-error-1').should('be.visible');
      })

      it('Modify an existing User lastname null', () => {
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
        cy.get('#mat-input-4').type('test2_user');

        // Click on save button
        cy.get('.mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label').click();

        // Check error message
        cy.get('#mat-mdc-error-2').should('have.text', 'Un nom est requis');
        cy.get('#mat-mdc-error-2').should('be.visible');
      })

    });

    context('US : XRLO-27 As an Admin, I could be able to delete an existing User', () => {

      it('Delete an existing User success', () => {
        cy.deleteExistingUser('test_user')
      })

      it('Delete an existing User close dialog with "No" button', () => {
        // Trigger mouseenter event to display actions buttons
        cy.get('#list-users-actions-test_user').trigger('mouseenter', {force: true});

        // Click on delete button
        cy.get('#list-users-actions-test_user > :nth-child(2) > .mat-icon').click();

        // Click on "No" button
        cy.get('[ng-reflect-dialog-result="false"] > .mdc-button__label').click();

        // Check User still in list
        cy.get('#list-users-actions-test_user').should('exist');
      })

      it('Delete an existing User close dialog by clicking outside the dialog', () => {
        // Trigger mouseenter event to display actions buttons
        cy.get('#list-users-actions-test_user').trigger('mouseenter', {force: true});

        // Click on delete button
        cy.get('#list-users-actions-test_user > :nth-child(2) > .mat-icon').click();

        // Click outside the dialog
        cy.get('.cdk-overlay-backdrop').click({ force: true });

        // Check dialog has been closed
        cy.get('.cdk-overlay-backdrop').should('not.exist');
        
        // Check User still in list
        cy.get('#list-users-actions-test_user').should('exist');
      })

    });

    

    context('US : XRLO-18 As an Admin, I must be able to create a team', () => {
      // TODO: US de Louis
    });
    
    context('US : XRLO-19 As an Admin, I must be able to delete a team', () => {
      // TODO: US de Louis
    });

    context('US : XRLO-20 As an Admin, I must be able to modify a team', () => {
      // TODO: US de Louis
    });

    
  
  })