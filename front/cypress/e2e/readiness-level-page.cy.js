describe("Readiness Level page tests", () => {
    let database;

    beforeEach(() => {
        cy.task("Seed_DB").then((result) => {
            database = result;
        });
    });

    beforeEach(() => {
        cy.visit("/");
        cy.PerformLogin("duboisj");
        cy.GoToPage("RL");
    });

    context("US : XRLO-95 As a User, I must be able to see all the readiness levels with the description of each ranks", () => {

        it('First Level of first Readiness Level is the default page', () => {
            cy.get('.dialog-head > h2').should('be.visible');
            cy.get('.dialog-head > h2').should('have.text', database.readiness_levels[0].name);
            cy.get('.dialog-head > p').should('be.visible');
            cy.get('.dialog-head > p').should('have.text', database.readiness_levels[0].description);
            cy.get('.short > h2').should('be.visible');
            cy.get('.short > h2').should('have.text', 'Rang ' + database.readiness_levels[0].levels[0].level);
            cy.get('.shortDescription > p').should('have.text', database.readiness_levels[0].levels[0].shortDescription);
            cy.get(':nth-child(1) > .longDescription').should('have.text', database.readiness_levels[0].levels[0].longDescription[0]);
            cy.get(':nth-child(2) > .longDescription').should('have.text', database.readiness_levels[0].levels[0].longDescription[1]);
            cy.get(':nth-child(3) > .longDescription').should('have.text', database.readiness_levels[0].levels[0].longDescription[2]);
        });

        it('Navigate between different Level', () => {

            cy.get(`.apexcharts-series > :nth-child(5)`).filter(':visible').click();

            cy.get('.dialog-head > h2').should('be.visible');
            cy.get('.dialog-head > h2').should('have.text', database.readiness_levels[0].name);
            cy.get('.dialog-head > p').should('be.visible');
            cy.get('.dialog-head > p').should('have.text', database.readiness_levels[0].description);
            cy.get('.short > h2').should('be.visible');
            cy.get('.short > h2').should('have.text', 'Rang ' + database.readiness_levels[0].levels[4].level);
            cy.get('.shortDescription > p').should('have.text', database.readiness_levels[0].levels[4].shortDescription);
            cy.get(':nth-child(1) > .longDescription').should('have.text', database.readiness_levels[0].levels[4].longDescription[0]);
            cy.get(':nth-child(2) > .longDescription').should('have.text', database.readiness_levels[0].levels[4].longDescription[1]);
            cy.get(':nth-child(3) > .longDescription').should('have.text', database.readiness_levels[0].levels[4].longDescription[2]);
            cy.get(':nth-child(4) > .longDescription').should('have.text', database.readiness_levels[0].levels[4].longDescription[3]);
        });

        it('Navigation between different Readiness Level', () => {

            cy.get(':nth-child(2) > .mat-mdc-cell > .readinessLevelButton > .mdc-button__label').click();

            cy.get('.dialog-head > h2').should('be.visible');
            cy.get('.dialog-head > h2').should('have.text', database.readiness_levels[1].name);
            cy.get('.dialog-head > p').should('be.visible');
            cy.get('.dialog-head > p').should('have.text', database.readiness_levels[1].description);
            cy.get('.short > h2').should('be.visible');
            cy.get('.short > h2').should('have.text', 'Rang ' + database.readiness_levels[1].levels[0].level);
        });

        it('Navigation between different Readiness Level keeps the active Level', () => {

            cy.get(`.apexcharts-series > :nth-child(5)`).filter(':visible').click();

            cy.get(':nth-child(2) > .mat-mdc-cell > .readinessLevelButton > .mdc-button__label').click();

            cy.get('.dialog-head > h2').should('be.visible');
            cy.get('.dialog-head > h2').should('have.text', database.readiness_levels[1].name);
            cy.get('.dialog-head > p').should('be.visible');
            cy.get('.dialog-head > p').should('have.text', database.readiness_levels[1].description);
            cy.get('.short > h2').should('be.visible');
            cy.get('.short > h2').should('have.text', 'Rang ' + database.readiness_levels[1].levels[4].level);
        });

        it('Every short & long description of every Level of every Readiness Level are accessible', () => {

            for (let i = 0; i < database.readiness_levels.length; i++) {

                cy.get(':nth-child(' + (i+1) + ') > .mat-mdc-cell > .readinessLevelButton > .mdc-button__label').click();

                cy.get('.dialog-head > h2').should('be.visible');
                cy.get('.dialog-head > h2').should('have.text', database.readiness_levels[i].name);
                cy.get('.dialog-head > p').should('be.visible');
                cy.get('.dialog-head > p').should('have.text', database.readiness_levels[i].description);

                for (let j = 0; j < 9; j++) {

                    cy.get(`.apexcharts-series > :nth-child(` + (9 - j) + `)`).filter(':visible').click();

                    cy.get('.short > h2').should('be.visible');
                    cy.get('.short > h2').should('have.text', 'Rang ' + (j + 1));
                    cy.get('.shortDescription > p').should('have.text', database.readiness_levels[i].levels[j].shortDescription);

                    for (let k = 1; k < database.readiness_levels[i].levels[j].longDescription.length + 1; k++) {
                        cy.get(':nth-child(' + k + ') > .longDescription').should('be.visible');
                        cy.get(':nth-child(' + k + ') > .longDescription').should('have.text', database.readiness_levels[i].levels[j].longDescription[k-1]);
                    }

                } 

            }

        });

    });
});