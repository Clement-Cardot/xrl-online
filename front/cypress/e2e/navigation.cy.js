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
      cy.get('#CreativeCommonsDescription').should('be.visible');
      cy.get('#CreativeCommonsDescription').should('have.text', 'Copyright © 2023 KTH Innovation Readiness Level™Attribution-NonCommercial-ShareAlike 4.0 International License.');
    })
  
    it('Home page test', () => {
      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').click();
      cy.get('.ng-star-inserted > p').should('have.text', 'home-page works!'); // TODO: add tests when home page is implemented
    })
  
    it('Project page test', () => {
      cy.get(':nth-child(2) > .mdc-button__label').click();
      // TODO: add tests when project page is implemented
    })
  
    it('Readiness levels page test', () => {
      cy.get(':nth-child(3) > .mdc-button__label').click();
      // TODO: add tests when readiness levels page is implemented
    })
  
    context('Admin menu tests', () => {
      
      beforeEach(() => {
        // Connect as an admin
        cy.PerformLogin('admin');
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
        cy.GoToPage('admin-RL');
  
        // Check that the page is loaded with correct elements
        cy.get('.search-add-container').should('exist');
        cy.get('.readiness-levels-container').should('exist');
      })
  
      it('Users/Teams admin page test', () => {
        // Open teams admin page
        cy.GoToPage('admin-teams');
  
        // Check that the page is loaded with correct elements
        cy.get('.user-container').should('exist');
        cy.get('.team-card-list').should('exist');
        cy.get('.search-add-container').should('exist');
      })
  
      it('Business lines admin page test', () => {
        // Open business lines admin page
        cy.GoToPage('admin-BL');
  
        // Check that the page is loaded with correct elements
        cy.get('.search-add-container').should('exist');
        cy.get('.business-lines-container').should('exist');
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
      cy.get('#CreativeCommonsDescription').should('be.visible');
      cy.get('#CreativeCommonsDescription').should('have.text', 'Copyright © 2023 KTH Innovation Readiness Level™Attribution-NonCommercial-ShareAlike 4.0 International License.');
    })
  
    it('Home page test', () => {
      cy.get('#barMenu > div > :nth-child(1) > .mdc-button__label').click();
      // TODO: add tests when home page is implemented
    })
  
    it('Project page test', () => {
      cy.get(':nth-child(2) > .mdc-button__label').click();
      
      // TODO: add tests when project page is implemented
    })
  
    it('Readiness levels page test', () => {
      cy.get(':nth-child(3) > .mdc-button__label').click();
      // TODO: add tests when readiness levels page is implemented
    })
  
    context('Admin menu tests', () => {
      
      beforeEach(() => {
        // Connect as an admin
        cy.PerformLogin('admin', 'en');
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
        cy.GoToPage('admin-RL');
  
        // Check that the page is loaded with correct elements
        cy.get('.search-add-container').should('exist');
        cy.get('.readiness-levels-container').should('exist');
      })
  
      it('Users/Teams admin page test', () => {
        // Open teams admin page
        cy.GoToPage('admin-teams');
  
        // Check that the page is loaded with correct elements
        cy.get('.user-container').should('exist');
        cy.get('.team-card-list').should('exist');
        cy.get('.search-add-container').should('exist');
      })
  
      it('Business lines admin page test', () => {
        // Open business lines admin page
        cy.GoToPage('admin-BL');
  
        // Check that the page is loaded with correct elements
        cy.get('.search-add-container').should('exist');
        cy.get('.business-lines-container').should('exist');
      })
  
    })

  });

  
})