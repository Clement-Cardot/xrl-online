describe('Login Tests', () => {

    beforeEach(() => {
        cy.visit('/');
    })

    let database;

    context('Login Component Loading Tests', () => {

        context('FR', () => {

            beforeEach(() => {
                cy.changeLang('fr');
                // Open login dialog before each test
                cy.get('#loginBtn > .mdc-button__label').click();
            })

            it('component load test', () => {
                // Check if login card is loaded and visible
                cy.get('#loginComponent').should('be.visible');
                cy.get('.close-button-login > .mat-mdc-button-touch-target').should('be.visible');
                cy.get('#loginForm').should('be.visible');
                cy.get('#loginField').should('be.visible');
                cy.get('#loginSubmitBtn').should('be.disabled');
                cy.get('#loginSubmitBtn').should('have.text', 'CONNEXION');
                cy.get('#mat-mdc-form-field-label-0 > mat-label').should('have.text', 'Entrer votre identifiant');
            })
    
            it('close button test', () => {
                // Check if the close button is working
                cy.get('.close-button-login > .mat-mdc-button-touch-target').click();
                cy.get('#loginComponent').should('not.exist');
            })
    
            it('login required error test', () => {
                // Click inside and outside the login field
                cy.get('#mat-input-login').click({ force: true });
                cy.get('#loginComponent').click();
                // Check error message
                cy.get('#mat-error-empty').should('be.visible');
                cy.get('#mat-error-empty').should('have.text', ' Un identifiant est requis ');
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
                cy.get('.close-button-login > .mat-mdc-button-touch-target').should('be.visible');
                cy.get('#loginForm').should('be.visible');
                cy.get('#loginField').should('be.visible');
                cy.get('#loginSubmitBtn').should('be.disabled');
                cy.get('#loginSubmitBtn').should('have.text', 'LOGIN');
                cy.get('#mat-mdc-form-field-label-0 > mat-label').should('have.text', 'Enter your login');
            })

        })

    })

    context('US: XRLO-56 - As a User, I must be able to login', () => {


        context('FR', () => {

            beforeEach(() => {
                cy.task('Seed_DB').then((result) => {
                    database = result;
                });

                cy.changeLang('fr');
            })
    
            it('login as admin', () => {
                cy.PerformLogin('admin');
            })
    
            it('login as standard user', () => {
                cy.PerformLogin(database.users[1].login);
            })
    
            it('login with wrong login', () => {
                // Open login dialog
                cy.get('#loginBtn > .mdc-button__label').click();
                
                // Intercept api call
                cy.intercept({
                    method: 'GET',
                    url: '/api/users/login?login=wronglogin',
                }).as('apiLogin')
    
                // Connect as an admin
                cy.get('#mat-input-login').click({force: true});
                cy.get('#mat-input-login').type('wronglogin');
                cy.get('#loginSubmitBtn > .mdc-button__label').click();
    
                // Check api response
                cy.wait('@apiLogin').then((interception) => {
                    expect(interception.response.statusCode).to.eq(404)
                    expect(interception.response.body).to.be.empty
                })
                
                // Check error message and button disabled
                cy.get('#mat-error-wrong-login').should('be.visible');
                cy.get('#mat-error-wrong-login').should('have.text', ' Identifiant incorrect ');
                cy.get('#loginSubmitBtn').should('be.disabled')
            })
    
        })

        context('EN', () => {

            beforeEach(() => {
                // Change language to english
                cy.changeLang('en');
                // reset database and add test data
                cy.task('Seed_DB').then((result) => {
                    database = result;
                });
            })
    
            it('login as admin', () => {
                cy.PerformLogin('admin', 'en');
            })
    
            it('login as standard user', () => {
                cy.PerformLogin(database.users[1].login, 'en');
            })
    
            it('login with wrong login', () => {
                // Open login dialog
                cy.get('#loginBtn > .mdc-button__label').click();

                // Intercept api call
                cy.intercept({
                    method: 'GET',
                    url: '/api/users/login?login=wronglogin',
                }).as('apiLogin')
    
                // Connect as an admin
                cy.get('#mat-input-login').click({force: true});
                cy.get('#mat-input-login').type('wronglogin');
                cy.get('#loginSubmitBtn > .mdc-button__label').click();
    
                // Check api response
                cy.wait('@apiLogin').then((interception) => {
                    expect(interception.response.statusCode).to.eq(404)
                    expect(interception.response.body).to.be.empty
                })
                
                // Check error message and button disabled
                cy.get('#mat-error-wrong-login').should('be.visible');
                cy.get('#mat-error-wrong-login').should('have.text', ' Login is incorrect ');
                cy.get('#loginSubmitBtn').should('be.disabled')
            })
    
        })

    })

})