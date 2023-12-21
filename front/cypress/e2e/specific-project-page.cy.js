describe("Specific Project page tests", () => {
    let database;

    beforeEach(() => {
        cy.task("Seed_DB").then((result) => {
            database = result;
        });
    });

    beforeEach(() => {
        cy.visit("/");
    });

    context("US : XRLO-33 As a User, I must be able to change the comment of the last assessment", () => {

        it('Modify last Assessment Comment success', () => {
            cy.PerformLogin("admin");
            cy.GoToPage("projects");

            cy.get('#project-card-'+database.projects[0]._id+' > .card > .front > .content > .card-header > h2').click();
            cy.get('#mat-tab-label-0-1').click();
            cy.get('.tab-content > #commentDiv > div > mat-form-field').click();
            cy.get('.tab-content > #commentDiv > div > mat-form-field').type('{selectall}{backspace}').type('New comment');
            cy.get('.tab-content > #commentDiv > div > button').click();
            
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Le commentaire a été mis à jour\n');
        });

        it('Modify no-last Assessment Comment unauthorized', () => {
            cy.PerformLogin("admin");
            cy.GoToPage("projects");
            cy.get('#project-card-'+database.projects[0]._id+' > .card > .front > .content > .card-header > h2').click();
            cy.get('#mat-tab-label-0-1').click();
            cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();

            cy.get('#commentDiv > .ng-star-inserted').should('be.visible');
            cy.get('#commentDiv > .ng-star-inserted').should('have.text', 'assessment 2');
        });

        it('Modify last Assessment Comment unauthorized', () => {

            cy.PerformLogin("duboisj");
            cy.GoToPage("projects");
            cy.get('#project-card-'+database.projects[0]._id+' > .card > .front > .content > .card-header > h2').click();
            cy.get('#mat-tab-label-0-1').click();

            cy.get('#commentDiv > p').should('be.visible');
            cy.get('#commentDiv > p').should('have.text', 'First assessment');
        });
        
    });
});