describe('Admin BusinessLine Page tests', () => {

  let database;

  beforeEach(() => {
      cy.task('Seed_DB').then((result) => {
        console.log(result);
        database = result;
      });
  })

  beforeEach(() => {
    cy.visit('/');
    cy.PerformLogin('admin');
    cy.GoToPage('admin-BL')
  })

  context('US : XRLO-79 As an Admin, I must be able to create a new Business Line', () => {

    it('Create a new BusinessLine success', () => {
      cy.addNewBusinessLine('New BusinessLine')
    })

    it('Create a new BusinessLine name already used', () => {
      // Intercept api call
      cy.intercept({
        method: 'POST',
        url: '/api/businessLines/create-businessLine',
      }).as('apiCreateBusinessLine')

      // Create new businessline
      cy.get('#addBusinessLine').click();
      cy.get('#mat-input-1').clear();
      cy.get('#mat-input-1').type(database.business_lines[0].name);
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait('@apiCreateBusinessLine').then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(409)
        } else {
          throw new Error('interception.response is undefined')
        }
      })

      // Check error message
      cy.get('#mat-mdc-error-2').should('have.text', "Ce nom de secteur d'activité existe déjà");
      cy.get('#mat-mdc-error-2').should('be.visible');
    })

    it('Create an BusinessLine with a name too short', () => {
      // Intercept api call
      cy.intercept({
        method: 'POST',
        url: '/api/businessLines/create-businessLine',
      }).as('apiCreateBusinessLine')

      // Update businessline
      // Create new businessline
      cy.get('#addBusinessLine').click();
      cy.get('#mat-input-1').clear();
      cy.get('#mat-input-1').type('a');

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#mat-input-1').focus();
      cy.get('#mat-input-1').blur();
      cy.get('#mat-mdc-error-1').should('be.visible');
      cy.get('#mat-mdc-error-1').should('have.text', 'Le nom du secteur d\'activité doit contenir au moins 3 caractères');

    })

    it('Create an BusinessLine with a name too long', () => {
      // Intercept api call
      cy.intercept({
        method: 'POST',
        url: '/api/businessLines/create-businessLine',
      }).as('apiCreateBusinessLine')

      // Update businessline
      // Create new businessline
      cy.get('#addBusinessLine').click();
      cy.get('#mat-input-1').clear();
      cy.get('#mat-input-1').type('a'.repeat(21));

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#mat-input-1').focus();
      cy.get('#mat-input-1').blur();
      cy.get('#mat-mdc-error-2').should('be.visible');
      cy.get('#mat-mdc-error-2').should('have.text', 'Le nom du secteur d\'activité ne doit pas dépasser 20 caractères');

    })

    it('Create a new BusinessLine name null', () => {
      // Create new businessline
      cy.get('#addBusinessLine').click();
      cy.get('#mat-input-1').focus();
      cy.get('#mat-input-1').blur();

      // // Check error message
      cy.get('#mat-mdc-error-1').should('be.visible');
      cy.get('#mat-mdc-error-1').should('have.text', 'Le nom du secteur d\'activité est requis');
    })

  });

  context('US : XRLO-81 As an Admin, I must be able to modify an existing Business Line', () => {

    it('Modify an existing BusinessLine success', () => {
      cy.modifyExistingBusinessLine('New Name')
    })

    it('Modify an existing BusinessLine name already exists', () => {
      // Intercept api call
      cy.intercept({
        method: 'PUT',
        url: '/api/businessLines/update-businessLine',
      }).as('apiModifyBusinessLine')

      // Update businessline
      cy.get(':nth-child(2) > .business-line-card > .mat-mdc-card > .mat-mdc-card-content > #business-line-title-container > :nth-child(2) > .mat-icon').click({ force: true });
      cy.get('#mat-input-1').clear();
      cy.get('#mat-input-1').type(database.business_lines[1].name);
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait('@apiModifyBusinessLine').then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(409)
        } else {
          throw new Error('interception.response is undefined')
        }
      })

      // Check SnackBar
      cy.get('#mat-mdc-error-2').should('be.visible');
      cy.get('#mat-mdc-error-2').should('have.text', 'Ce nom de secteur d\'activité existe déjà');

    })

    it('Modify an existing BusinessLine name too short', () => {
      // Intercept api call
      cy.intercept({
        method: 'PUT',
        url: '/api/businessLines/update-businessLine',
      }).as('apiModifyBusinessLine')

      // Update businessline
      cy.get(':nth-child(2) > .business-line-card > .mat-mdc-card > .mat-mdc-card-content > #business-line-title-container > :nth-child(2) > .mat-icon').click({ force: true });
      cy.get('#mat-input-1').clear();
      cy.get('#mat-input-1').type('a');

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#mat-input-1').focus();
      cy.get('#mat-input-1').blur();
      cy.get('#mat-mdc-error-1').should('be.visible');
      cy.get('#mat-mdc-error-1').should('have.text', 'Le nom du secteur d\'activité doit contenir au moins 3 caractères');

    })

    it('Modify an existing BusinessLine name too long', () => {
      // Intercept api call
      cy.intercept({
        method: 'PUT',
        url: '/api/businessLines/update-businessLine',
      }).as('apiModifyBusinessLine')

      // Update businessline
      cy.get(':nth-child(2) > .business-line-card > .mat-mdc-card > .mat-mdc-card-content > #business-line-title-container > :nth-child(2) > .mat-icon').click({ force: true });
      cy.get('#mat-input-1').clear();
      cy.get('#mat-input-1').type('a'.repeat(21));

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#mat-input-1').focus();
      cy.get('#mat-input-1').blur();
      cy.get('#mat-mdc-error-2').should('be.visible');
      cy.get('#mat-mdc-error-2').should('have.text', 'Le nom du secteur d\'activité ne doit pas dépasser 20 caractères');

    })

    it('Modify a new BusinessLine name null', () => {
      // Create new businessline
      // Update businessline
      cy.get(':nth-child(2) > .business-line-card > .mat-mdc-card > .mat-mdc-card-content > #business-line-title-container > :nth-child(2) > .mat-icon').click({ force: true });
      cy.get('#mat-input-1').clear();
      cy.get('#mat-input-1').focus();
      cy.get('#mat-input-1').blur();

      // // Check error message
      cy.get('#mat-mdc-error-1').should('be.visible');
      cy.get('#mat-mdc-error-1').should('have.text', 'Le nom du secteur d\'activité est requis');
    })

  });

  context('US : XRLO-27 As an Admin, I could be able to delete an existing Business Line', () => {

    it('Delete an existing BusinessLine success', () => {

    })

  });

})
