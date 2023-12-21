describe("Compare dialog tests", () => {
    let database;

    beforeEach(() => {
        cy.task("Seed_DB").then((result) => {
        database = result;
        });
    });

    beforeEach(() => {
        let idProject = database.projects[0]._id;
        cy.visit("/");
        cy.PerformLogin("admin");
        cy.GoToPage("projects");
        cy.get(`#project-card-${idProject} > .card > .front > .content > .card-header > h2`).click();
    });

    it("compare dialog default value last assessment", () => {
        // Open compare dialog
        cy.get('#compare').click();
        
        // Check that default value is correct
        cy.get('.mat-mdc-select-value-text > .mat-mdc-select-min-line').should('have.text', '27/08/2023');
    });

    it("compare dialog default value selected assessment", () => {
        // Change selected assessment
        cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();
        // Get assessment date
        cy.get('.date').invoke('text').then((date) => {

            // Open compare dialog
            cy.get('#compare > .mdc-button__label').click();

            // Check that default value is correct
            cy.get('.mat-mdc-select-value-text > .mat-mdc-select-min-line').should('have.text', date.trim());
        });        
    });

});