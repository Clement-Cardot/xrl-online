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
      cy.get('.add-container > .mdc-button > .mdc-button__label').click();
      cy.get('#businessLineName-input').click();
      cy.get('#businessLineName-input').clear();
      cy.get('#businessLineName-input').type(database.business_lines[0].name);
      cy.get('#confirm').click();

      // Check api response
      cy.wait('@apiCreateBusinessLine').then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(409)
        } else {
          throw new Error('interception.response is undefined')
        }
      })

      // Check error message
      cy.get('#businessLineName-mat-error').should('have.text', "Ce nom de secteur d'activité existe déjà");
      cy.get('#businessLineName-mat-error').should('be.visible');
    })

    it('Create an BusinessLine with a name too short', () => {
      // Intercept api call
      cy.intercept({
        method: 'POST',
        url: '/api/businessLines/create-businessLine',
      }).as('apiCreateBusinessLine')

      // Create new businessline
      cy.get('.add-container > .mdc-button > .mdc-button__label').click();
      cy.get('#businessLineName-input').clear();
      cy.get('#businessLineName-input').type('a');

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#businessLineName-input').focus();
      cy.get('#businessLineName-input').blur();
      cy.get('#businessLineName-mat-error').should('be.visible');
      cy.get('#businessLineName-mat-error').should('have.text', 'Le nom du secteur d\'activité doit contenir au moins 3 caractères');

    })

    it('Create an BusinessLine with a name too long', () => {
      // Intercept api call
      cy.intercept({
        method: 'POST',
        url: '/api/businessLines/create-businessLine',
      }).as('apiCreateBusinessLine')

      // Create new businessline
      cy.get('.add-container > .mdc-button > .mdc-button__label').click();
      cy.get('#businessLineName-input').clear();
      cy.get('#businessLineName-input').type('a'.repeat(21));

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#businessLineName-input').focus();
      cy.get('#businessLineName-input').blur();
      cy.get('#businessLineName-mat-error').should('be.visible');
      cy.get('#businessLineName-mat-error').should('have.text', 'Le nom du secteur d\'activité ne doit pas dépasser 20 caractères');

    })

    it('Create a new BusinessLine name null', () => {
      // Create new businessline
      cy.get('.add-container > .mdc-button > .mdc-button__label').click();
      cy.get('#businessLineName-input').focus();
      cy.get('#businessLineName-input').blur();

      // // Check error message
      cy.get('#businessLineName-input').should('be.visible');
      cy.get('#businessLineName-mat-error').should('have.text', 'Le nom du secteur d\'activité est requis');
    })

  });

  context('US : XRLO-81 As an Admin, I must be able to modify an existing Business Line', () => {

    let businessLineId;

    beforeEach(() => {
      businessLineId = database.business_lines[1]._id;
    })

    it('Modify an existing BusinessLine success', () => {
      cy.modifyExistingBusinessLine(businessLineId, 'New Name')
    })

    it('Modify an existing BusinessLine name already exists', () => {
      // Intercept api call
      cy.intercept({
        method: 'PUT',
        url: '/api/businessLines/update-businessLine',
      }).as('apiModifyBusinessLine')

      // Update businessline
      cy.get('#business-line-card-' + businessLineId + '> mat-card-header > .icons-container > #modify').click({ force: true });
      cy.get('#businessLineName-input').clear();
      cy.get('#businessLineName-input').type(database.business_lines[0].name);
      cy.get('#confirm').click();

      // Check api response
      cy.wait('@apiModifyBusinessLine').then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(409)
        } else {
          throw new Error('interception.response is undefined')
        }
      })

      // Check SnackBar
      cy.get('#businessLineName-mat-error').should('be.visible');
      cy.get('#businessLineName-mat-error').should('have.text', 'Ce nom de secteur d\'activité existe déjà');

    })

    it('Modify an existing BusinessLine name too short', () => {
      // Intercept api call
      cy.intercept({
        method: 'PUT',
        url: '/api/businessLines/update-businessLine',
      }).as('apiModifyBusinessLine')

      // Update businessline
      cy.get('#business-line-card-' + businessLineId + '> mat-card-header > .icons-container > #modify').click({ force: true });
      cy.get('#businessLineName-input').clear();
      cy.get('#businessLineName-input').type('a');

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#businessLineName-input').focus();
      cy.get('#businessLineName-input').blur();
      cy.get('#businessLineName-mat-error').should('be.visible');
      cy.get('#businessLineName-mat-error').should('have.text', 'Le nom du secteur d\'activité doit contenir au moins 3 caractères');

    })

    it('Modify an existing BusinessLine name too long', () => {
      // Intercept api call
      cy.intercept({
        method: 'PUT',
        url: '/api/businessLines/update-businessLine',
      }).as('apiModifyBusinessLine')

      // Update businessline
      cy.get('#business-line-card-' + businessLineId + '> mat-card-header > .icons-container > #modify').click({ force: true });
      cy.get('#businessLineName-input').clear();
      cy.get('#businessLineName-input').type('a'.repeat(21));

      // Check save button is disabled
      cy.get('#mat-mdc-dialog-1 > div > div > app-add-update-businessline-dialog > div > div.mat-mdc-dialog-actions.mdc-dialog__actions > :nth-child(2)').should('be.disabled');

      // Check SnackBar
      cy.get('#businessLineName-input').focus();
      cy.get('#businessLineName-input').blur();
      cy.get('#businessLineName-mat-error').should('be.visible');
      cy.get('#businessLineName-mat-error').should('have.text', 'Le nom du secteur d\'activité ne doit pas dépasser 20 caractères');

    })

    it('Modify a new BusinessLine name null', () => {
      // Update businessline
      cy.get('#business-line-card-' + businessLineId + '> mat-card-header > .icons-container > #modify').click({ force: true });
      cy.get('#businessLineName-input').clear();
      cy.get('#businessLineName-input').focus();
      cy.get('#businessLineName-input').blur();

      // Check error message
      cy.get('#businessLineName-mat-error').should('be.visible');
      cy.get('#businessLineName-mat-error').should('have.text', 'Le nom du secteur d\'activité est requis');
    })

  });

  context('US : XRLO-27 As an Admin, I could be able to delete an existing Business Line', () => {

    let businessLineId;

    beforeEach(() => {
      businessLineId = database.business_lines[1]._id;
    })

    it('Delete an existing BusinessLine success', () => {
      cy.deleteExistingBusinessLine(businessLineId)
    })

  });

  context('As an Admin, I can see which projects are linked with a BusinessLine', () => {

    let businessLineId;

    it('Check Projects for a linked BusinessLine', () => {
      cy.get('#mat-expansion-panel-header-4 > .mat-content > .mat-expansion-panel-header-title').should('have.text', ' 2 projet(s) lié(s) ');
      cy.get('#mat-expansion-panel-header-4 > .mat-content > .mat-expansion-panel-header-title').should('be.visible');
      cy.get('#mat-expansion-panel-header-4').click();
      cy.get('.cdk-column-projectName').should('be.visible');
      cy.get('.cdk-column-projectTeamName').should('be.visible');

      cy.get(':nth-child(1) > .cdk-column-projectName').should('have.text', ' Project 1 ');
      cy.get(':nth-child(2) > .cdk-column-projectName').should('have.text', ' Project 2 ');
      cy.get(':nth-child(1) > .cdk-column-projectTeamName').should('have.text', ' Team1 ');
      cy.get(':nth-child(2) > .cdk-column-projectTeamName').should('have.text', ' Team1 ');
    })

    it('Check Projects for an un-linked BusinessLine', () => {
      cy.get('#mat-expansion-panel-header-1 > .mat-content > .mat-expansion-panel-header-title').should('have.text', ' Aucun projet lié ');
      cy.get('#mat-expansion-panel-header-1 > .mat-content > .mat-expansion-panel-header-title').should('be.visible');
    })

  });

})
