describe('Pages Loading Tests', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  context('FR', () => {
  
    it('Navbar loading test', () => {
      // Check that the navbar has all default buttons
      cy.get('#mainButton > .mdc-button__label').should('be.visible');
      cy.get('#mainButton > .mdc-button__label').should('have.text', 'xRL Online');

      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('be.visible');
      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('have.text', 'Accueil');

      cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('be.visible');
      cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('have.text', 'Projets');

      cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('be.visible');
      cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('have.text', 'Niveaux de Maturité');

      cy.get('#language-button > .mat-mdc-button-touch-target').should('be.visible');

      cy.get('#loginBtn > .mdc-button__label').should('be.visible');
      cy.get('#loginBtn > .mdc-button__label').should('have.text', 'CONNEXION');
    })
  
    it('Footer loading test', () => {
      // Check that the footer is loaded with correct elements
      cy.get('#ThalesDiv').should('be.visible');
      cy.get('#ThalesDiv').should('have.text', 'Thales2023 - Tous droits réservés');
      cy.get('#KTHDiv').should('be.visible');
      cy.get('#KTHDiv').should('have.text', 'Le travail de KTH est placée sous une licence Creative Commons  Attribution-NonCommercial-ShareAlike 4.0 International License.');
    })
  
    it('Home page test', () => {
      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').click();
      cy.get('.ng-star-inserted > p').should('have.text', 'home-page works!'); // TODO: add tests when home page is implemented
    })
  
    it('Project page test', () => {
      cy.get(':nth-child(2) > .mdc-button__label').click();
      cy.get('.ng-star-inserted > p').should('have.text', 'projects-page works!'); // TODO: add tests when project page is implemented
    })
  
    it('Readiness levels page test', () => {
      cy.get(':nth-child(3) > .mdc-button__label').click();
      cy.get('.ng-star-inserted > p').should('have.text', 'readiness-level-page works!'); // TODO: add tests when readiness levels page is implemented
    })
  
    context('Admin menu tests', () => {
      
      beforeEach(() => {
        // Connect as an admin
        cy.get('#loginBtn > .mdc-button__label').click();
        cy.get('#loginComponent').should('be.visible');
        cy.get('mat-label.ng-tns-c1205077789-4').click();
        cy.get('#mat-input-0').type('admin');
        cy.get('#loginSubmitBtn > .mdc-button__label').click();
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').should('be.visible');
      })
  
      it('Navbar as admin test', () => {
        // Check that the navbar has all default buttons
        cy.get('#mainButton > .mdc-button__label').should('be.visible');
        cy.get('#mainButton > .mdc-button__label').should('have.text', 'xRL Online');

        cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('be.visible');
        cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('have.text', 'Accueil');

        cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('be.visible');
        cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('have.text', 'Projets');

        cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('be.visible');
        cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('have.text', 'Niveaux de Maturité');

        cy.get('#language-button > .mat-mdc-button-touch-target').should('be.visible');

        // Check that Login button is replaced by Logout button
        cy.get('#logoutBtn > .mdc-button__label').should('be.visible');
        cy.get('#logoutBtn > .mdc-button__label').should('have.text', 'DÉCONNEXION');

        // Check that admin menu button is visible
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').should('be.visible');
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').should('have.text', ' Gestion ');
      })
  
      it('Readiness levels admin page test', () => {
        // Open readiness levels admin page
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').click();
        cy.get('.cdk-focused > .mat-mdc-menu-item-text').click();
  
        // Check that the page is loaded with correct elements
        cy.get('.ng-star-inserted > p').should('be.visible');
        cy.get('.ng-star-inserted > p').should('have.text', 'admin-readiness-level-page works!'); // TODO: add tests when readiness levels admin page is implemented
      })
  
      it('Teams admin page test', () => {
        // Open teams admin page
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').click();
        cy.get('.mat-mdc-menu-content > :nth-child(2)').click();
  
        // Check that the page is loaded with correct elements
        cy.get('#users-management').should('be.visible');
        cy.get('.team-container').should('be.visible');
        cy.get('app-add-team-card > .mat-mdc-card').should('be.visible');
        cy.get(':nth-child(2) > .mat-mdc-card').should('be.visible');
        cy.get(':nth-child(3) > .mat-mdc-card').should('be.visible');
      })
  
      it('Business lines admin page test', () => {
        // Open business lines admin page
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').click();
        cy.get(':nth-child(3) > .mat-mdc-menu-item-text').click();
  
        // Check that the page is loaded with correct elements
        cy.get('.ng-star-inserted > p').should('be.visible');
        cy.get('.ng-star-inserted > p').should('have.text', 'admin-business-line-page works!'); // TODO: add tests when business lines admin page is implemented
      })
  
    })

  });

  context('EN', () => {

    beforeEach(() => {
      // Change language to english
      cy.changeLang('en');
    })
  
    it('Navbar loading test', () => {
      // Check that the navbar has all default buttons
      cy.get('#mainButton > .mdc-button__label').should('be.visible');
      cy.get('#mainButton > .mdc-button__label').should('have.text', 'xRL Online');

      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('be.visible');
      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('have.text', 'Home');

      cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('be.visible');
      cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('have.text', 'Projects');

      cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('be.visible');
      cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('have.text', 'Readiness Levels');

      cy.get('#language-button > .mat-mdc-button-touch-target').should('be.visible');

      cy.get('#loginBtn > .mdc-button__label').should('be.visible');
      cy.get('#loginBtn > .mdc-button__label').should('have.text', 'LOGIN');
    })
  
    it('Footer loading test', () => {
      // Check that the footer is loaded with correct elements
      cy.get('#ThalesDiv').should('be.visible');
      cy.get('#ThalesDiv').should('have.text', 'Thales2023 - All rights reserved');
      cy.get('#KTHDiv').should('be.visible');
      cy.get('#KTHDiv > p').should('have.text', 'The KTH work is licensed under a Creative Commons  Attribution-NonCommercial-ShareAlike 4.0 International License.');
      cy.get('#KTHDiv > img').should('be.visible');
    })
  
    it('Home page test', () => {
      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').click();
      cy.get('.ng-star-inserted > p').should('have.text', 'home-page works!'); // TODO: add tests when home page is implemented
    })
  
    it('Project page test', () => {
      cy.get(':nth-child(2) > .mdc-button__label').click();
      cy.get('.ng-star-inserted > p').should('have.text', 'projects-page works!'); // TODO: add tests when project page is implemented
    })
  
    it('Readiness levels page test', () => {
      cy.get(':nth-child(3) > .mdc-button__label').click();
      cy.get('.ng-star-inserted > p').should('have.text', 'readiness-level-page works!'); // TODO: add tests when readiness levels page is implemented
    })
  
    context('Admin menu tests', () => {
      
      beforeEach(() => {
        // Connect as an admin
        cy.get('#loginBtn > .mdc-button__label').click();
        cy.get('#loginComponent').should('be.visible');
        cy.get('mat-label.ng-tns-c1205077789-4').click();
        cy.get('#mat-input-0').type('admin');
        cy.get('#loginSubmitBtn > .mdc-button__label').click();
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').should('be.visible');
      })
  
      it('Navbar as admin test', () => {
        // Check that the navbar has all default buttons
        cy.get('#mainButton > .mdc-button__label').should('be.visible');
        cy.get('#mainButton > .mdc-button__label').should('have.text', 'xRL Online');

        cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('be.visible');
        cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').should('have.text', 'Home');

        cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('be.visible');
        cy.get('#barMenu > div > :nth-child(2) > .mdc-button__label').should('have.text', 'Projects');

        cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('be.visible');
        cy.get('#barMenu > div > :nth-child(3) > .mdc-button__label').should('have.text', 'Readiness Levels');

        cy.get('#language-button > .mat-mdc-button-touch-target').should('be.visible');

        // Check that Login button is replaced by Logout button
        cy.get('#logoutBtn > .mdc-button__label').should('be.visible');
        cy.get('#logoutBtn > .mdc-button__label').should('have.text', 'LOGOUT');

        // Check that admin menu button is visible
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').should('be.visible');
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').should('have.text', ' Management ');
      })
  
      it('Readiness levels admin page test', () => {
        // Open readiness levels admin page
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').click();
        cy.get('.cdk-focused > .mat-mdc-menu-item-text').click();
  
        // Check that the page is loaded with correct elements
        cy.get('.ng-star-inserted > p').should('be.visible');
        cy.get('.ng-star-inserted > p').should('have.text', 'admin-readiness-level-page works!'); // TODO: add tests when readiness levels admin page is implemented
      })
  
      it('Teams admin page test', () => {
        // Open teams admin page
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').click();
        cy.get('.mat-mdc-menu-content > :nth-child(2)').click();
  
        // Check that the page is loaded with correct elements
        cy.get('#users-management').should('be.visible');
        cy.get('.team-container').should('be.visible');
        cy.get('app-add-team-card > .mat-mdc-card').should('be.visible');
        cy.get(':nth-child(2) > .mat-mdc-card').should('be.visible');
        cy.get(':nth-child(3) > .mat-mdc-card').should('be.visible');
      })
  
      it('Business lines admin page test', () => {
        // Open business lines admin page
        cy.get('.mat-mdc-menu-trigger > .mdc-button__label').click();
        cy.get(':nth-child(3) > .mat-mdc-menu-item-text').click();
  
        // Check that the page is loaded with correct elements
        cy.get('.ng-star-inserted > p').should('be.visible');
        cy.get('.ng-star-inserted > p').should('have.text', 'admin-business-line-page works!'); // TODO: add tests when business lines admin page is implemented
      })
  
    })

  });

  
})