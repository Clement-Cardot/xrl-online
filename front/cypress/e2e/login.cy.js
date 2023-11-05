describe('Login Tests', () => {

    beforeEach(() => {
        cy.visit('/');
    })

    context('Login Component Loading Tests', () => {

        context('FR', () => {

            beforeEach(() => {
                // Open login dialog before each test
                cy.get('#loginBtn > .mdc-button__label').click();
            })

            it('component load test', () => {
                // Check if login card is loaded and visible
                cy.get('#loginComponent').should('be.visible');
                cy.get('.close-button > .mat-mdc-button-touch-target').should('be.visible');
                cy.get('#loginForm').should('be.visible');
                cy.get('#loginField').should('be.visible');
                cy.get('#loginSubmitBtn').should('be.disabled');
                cy.get('#loginSubmitBtn').should('have.text', 'CONNEXION');
                cy.get('#mat-mdc-form-field-label-0 > mat-label').should('have.text', 'Entrer votre identifiant');
            })
    
            it('close button test', () => {
                // Check if the close button is working
                cy.get('.close-button > .mat-mdc-button-touch-target').click();
                cy.get('#loginComponent').should('not.exist');
            })
    
            it('login required error test', () => {
                // Click inside and outside the login field
                cy.get('mat-label.ng-tns-c1205077789-4').click();
                cy.get('#mat-input-0').click();
                cy.get('#loginComponent').click();
                // Check error message
                cy.get('#mat-mdc-error-0').should('be.visible');
                cy.get('#mat-mdc-error-0').should('have.text', ' Un identifiant est requis ');
            })
    
            it('login click outside', () => {
                // Click outiside the dialog
                cy.get('.cdk-overlay-backdrop').click(-50, -50, { force: true });
                // Check if the dialog is still visible
                cy.get('#loginComponent').should('be.visible');
            })

        })

        context('EN', () => {

            beforeEach(() => {
                // Change language to english
                cy.changeLang('en');
                // Open login dialog before each test
                cy.get('#loginBtn > .mdc-button__label').click();
            })
    
            it('component load test', () => {
                // Check if login card is loaded and visible
                cy.get('#loginComponent').should('be.visible');
                cy.get('.close-button > .mat-mdc-button-touch-target').should('be.visible');
                cy.get('#loginForm').should('be.visible');
                cy.get('#loginField').should('be.visible');
                cy.get('#loginSubmitBtn').should('be.disabled');
                cy.get('#loginSubmitBtn').should('have.text', 'LOGIN');
                cy.get('#mat-mdc-form-field-label-0 > mat-label').should('have.text', 'Enter your login');
            })

        })

    })

    context('US: XRLO-56 - As a User, I must be able to login', () => {

        const usersTestData = [{login: 'admin', firstName: 'admin', lastName: 'admin'}, {login: 'test_user', firstName: 'test_user_firstname', lastName: 'test_user_lastname'}]

        context('FR', () => {

            beforeEach(() => {
                // Open login dialog before each test
                cy.get('#loginBtn > .mdc-button__label').click();
                // reset database and add test data
                cy.resetCollection('users');
                cy.addManyToCollection('users', usersTestData)
            })
    
            it('login as admin', () => {
                cy.PerformLogin('admin');
            })
    
            it('login as test_user', () => {
                cy.PerformLogin('test_user');
            })
    
            it('login with wrong login', () => {
                // Intercept api call
                cy.intercept({
                    method: 'GET',
                    url: 'http://localhost:8080/login?login=wronglogin',
                }).as('apiLogin')
    
                // Connect as an admin
                cy.get('mat-label.ng-tns-c1205077789-4').click();
                cy.get('#mat-input-0').type('wronglogin');
                cy.get('#loginSubmitBtn > .mdc-button__label').click();
    
                // Check api response
                cy.wait('@apiLogin').then((interception) => {
                    expect(interception.response.statusCode).to.eq(404)
                    expect(interception.response.body).to.be.empty
                })
                
                // Check error message and button disabled
                cy.get('#mat-mdc-error-1').should('be.visible');
                cy.get('#mat-mdc-error-1').should('have.text', ' Identifiant incorrect ');
                cy.get('#loginSubmitBtn').should('be.disabled')
            })
    
        })

        context('EN', () => {

            beforeEach(() => {
                // Change language to english
                cy.changeLang('en');
                // Open login dialog before each test
                cy.get('#loginBtn > .mdc-button__label').click();
                // reset database and add test data
                cy.resetCollection('users');
                cy.addManyToCollection('users', usersTestData)
            })
    
            it('login as admin', () => {
                cy.PerformLogin('admin', 'en');
            })
    
            it('login as test_user', () => {
                cy.PerformLogin('test_user', 'en');
            })
    
            it('login with wrong login', () => {
                // Intercept api call
                cy.intercept({
                    method: 'GET',
                    url: 'http://localhost:8080/login?login=wronglogin',
                }).as('apiLogin')
    
                // Connect as an admin
                cy.get('mat-label.ng-tns-c1205077789-4').click();
                cy.get('#mat-input-0').type('wronglogin');
                cy.get('#loginSubmitBtn > .mdc-button__label').click();
    
                // Check api response
                cy.wait('@apiLogin').then((interception) => {
                    expect(interception.response.statusCode).to.eq(404)
                    expect(interception.response.body).to.be.empty
                })
                
                // Check error message and button disabled
                cy.get('#mat-mdc-error-1').should('be.visible');
                cy.get('#mat-mdc-error-1').should('have.text', ' Login is incorrect ');
                cy.get('#loginSubmitBtn').should('be.disabled')
            })
    
        })

    })

})