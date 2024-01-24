describe("Specific Project page tests", () => {
    let database;

    beforeEach(() => {
        cy.task("Seed_DB").then((result) => {
            database = result;
        });
    });

    beforeEach(() => {
        cy.visit("/");
        cy.changeLang('fr');
        cy.PerformLogin("admin");
        cy.GoToPage("projects");
        cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > h2').click();
    });

    context("Information TAB in Project is well generated", () => {

        it('Every informations are present', () => {
            cy.get('#topLeft > h2').should('be.visible');
            cy.get('#topLeft > h2').should('have.text', 'Equipe : Team1');
            cy.get('#topRight > h2').should('be.visible');
            cy.get('#topRight > h2').should('have.text', 'Secteur d\'activité : Business Line 1 ');
            cy.get('#centerPart > h2').should('be.visible');
            cy.get('#centerPart > h2').should('have.text', 'Description :');
            cy.get('#centerPart > h4').should('be.visible');
            cy.get('#centerPart > h4').should('have.text', database.projects[0].description);
            cy.get('#bottomLeft > h4').should('be.visible');
            cy.get('#bottomLeft > h4').should('have.text', 'Date de début du projet : 27/08/2021');
            cy.get('#bottomRight > h4').should('be.visible');
            cy.get('#bottomRight > h4').should('have.text', 'Nombre d\'évaluations : ' + database.projects[0].assessments.length);

            cy.get('#topLeft > .mat-icon').click();
            cy.get('.info-member-team-component > div > h2').should('be.visible');
            cy.get('.info-member-team-component > div > h2').should('have.text', 'Membres de l\'équipe');
            cy.get(':nth-child(1) > .firstNameCell').should('be.visible');
            cy.get(':nth-child(1) > .firstNameCell').should('have.text', ' admin ');
            cy.get(':nth-child(1) > .lastNameCell').should('be.visible');
            cy.get(':nth-child(1) > .lastNameCell').should('have.text', ' admin ');
            cy.get(':nth-child(2) > .firstNameCell').should('be.visible');
            cy.get(':nth-child(2) > .firstNameCell').should('have.text', ' Clément ');
            cy.get(':nth-child(2) > .lastNameCell').should('be.visible');
            cy.get(':nth-child(2) > .lastNameCell').should('have.text', ' Cardot ');

            cy.get('.close-button-login > .mat-mdc-button-touch-target').click();
        });

    });

    context("US : XRLO-33 As a User, I must be able to change the comment of any assessment", () => {

        beforeEach(() => {
            cy.get('#mat-tab-label-0-1').click();
        });

        it('Modify last Assessment Comment success', () => {
            cy.get('.tab-content > #commentDiv  > mat-form-field').type('{selectall}{backspace}').type('New comment');
            cy.get('.tab-content > #commentDiv > div > button').click();

            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ' Le commentaire a été mis à jour\n');
        });

        it('Modify no-last Assessment Comment unauthorized', () => {
            cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();

            cy.get('#lastAssessmentComment').should('be.visible');
            cy.get('#lastAssessmentComment').should('have.value', 'assessment 2');

            cy.get('#lastAssessmentComment').trigger('mouseover', { force: true });
            cy.get('#lastAssessmentComment').click();

            cy.get(".cdk-overlay-pane > mat-tooltip-component > div > div").should('have.text', 'Vous ne pouvez pas modifier le commentaire de cette évaluation');
        });

        it('Modify no-last Assessment Comment authorized', () => {
            cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();

            cy.get('#mat-mdc-checkbox-2-input').check();
            cy.get('.tab-content > #commentDiv > mat-form-field').type('{selectall}{backspace}').type('New comment');
            cy.get('.tab-content > #commentDiv > div > button').click();

            cy.get('#mat-mdc-form-field-label-6 > mat-label').should('be.visible');
            cy.get('#mat-mdc-form-field-label-6 > mat-label').should('have.text', 'Laisser un commentaire');

            cy.get('#mat-mdc-checkbox-2-input').uncheck();

            cy.get('#lastAssessmentComment').trigger('mouseover', { force: true });
            cy.get('#lastAssessmentComment').click();

            cy.get(".cdk-overlay-pane > mat-tooltip-component > div > div").should('have.text', 'Vous ne pouvez pas modifier le commentaire de cette évaluation');
            cy.get('#lastAssessmentComment').should('have.value', 'New comment');
        });

        it('Modify last Assessment Comment unauthorized', () => {

            cy.PerformLogout();
            cy.PerformLogin("duboisj");
            cy.GoToPage("projects");
            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > h2').click();

            cy.get('#mat-tab-label-1-1 > .mdc-tab__content').click();

            cy.get('#buttonZone').should('have.text', 'Enregistrer');

            cy.get('#lastAssessmentComment').trigger('mouseover', { force: true });
            cy.get('#lastAssessmentComment').click();
            cy.get(".cdk-overlay-pane > mat-tooltip-component > div > div").should('have.text', 'Vous ne pouvez pas modifier le commentaire de cette évaluation');
            cy.get('#lastAssessmentComment').should('have.value', 'First assessment');
        });

    });

    context("US : XRLO-147 As a User, I must be able to see the comment of any RL rank of any Assessment", () => {

        // Every RL pixel coordinates : Funding, Team, IPR, Business Model, Technology, Customer
        const labels = [[80, 150], [80, 450], [345, 590], [617, 450], [607, 150], [345, 10]];
        const ranks = [[180, 210], [155, 405], [340, 575], [555, 415], [580, 162], [348, 55]];

        beforeEach(() => {
            cy.get('#mat-tab-label-0-2').click();
        });

        it('See the comment of the first RL of the last Assessment', () => {
            cy.get('h2').should('be.visible');
            cy.get('h2').should('have.text', 'Customer');
            cy.get('.readiness-level-description > p').should('be.visible');
            cy.get('.readiness-level-description > p').should('have.text', 'Preparedness of potential customers or markets to adopt a new product, service, or technology. It assesses various aspects such as customer awareness, willingness to change, understanding of the offering, and the readiness to commit resources for adoption.');
            cy.get('.readiness-level-rank > h3').should('be.visible');
            cy.get('.readiness-level-rank > h3').should('have.text', 'Rang : 8');
            cy.get('.readiness-level-comment > p').should('be.visible');
            cy.get('.readiness-level-comment > p').should('have.text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod.');
        });

        it('Switching Assessment changes the displayed comment', () => {
            cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();

            cy.get('h2').should('be.visible');
            cy.get('h2').should('have.text', 'Customer');
            cy.get('.readiness-level-description > p').should('be.visible');
            cy.get('.readiness-level-description > p').should('have.text', 'Preparedness of potential customers or markets to adopt a new product, service, or technology. It assesses various aspects such as customer awareness, willingness to change, understanding of the offering, and the readiness to commit resources for adoption.');
            cy.get('.readiness-level-rank > h3').should('be.visible');
            cy.get('.readiness-level-rank > h3').should('have.text', 'Rang : 5');
            cy.get('.readiness-level-comment > p').should('be.visible');
            cy.get('.readiness-level-comment > p').should('have.text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod.');
        });

        it('Clicking on the label of a RL in the graph changes the displayed comment', () => {
            cy.get('canvas').then($canvas => {
                cy.wrap($canvas)
                    .click(labels[4][0], labels[4][1]);
            })

            cy.get('h2').should('be.visible');
            cy.get('h2').should('have.text', 'Technology');
            cy.get('.readiness-level-description > p').should('be.visible');
            cy.get('.readiness-level-description > p').should('have.text', 'Technology = Product/service/method/system/technology/solution etc. The “thing”, or tangible realization of the idea, that you want to develop.');
            cy.get('.readiness-level-rank > h3').should('be.visible');
            cy.get('.readiness-level-rank > h3').should('have.text', 'Rang : 9');
            cy.get('.readiness-level-comment > p').should('be.visible');
            cy.get('.readiness-level-comment > p').should('have.text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod.');
        });

        // Test not working due to pixel coordinates but feature is working
        // it('Clicking on the rank of a RL in the graph changes the displayed comment', () => {
        //     cy.get('canvas').then($canvas => {
        //         cy.wrap($canvas)
        //             .trigger('mousemove', ranks[4][0], ranks[4][1]).trigger('mouseover')
        //             .click(ranks[4][0], ranks[4][1], { force: true });
        //     })

        //     cy.get('h2').should('be.visible');
        //     cy.get('h2').should('have.text', 'Technology');
        //     cy.get('.readiness-level-description > p').should('be.visible');
        //     cy.get('.readiness-level-description > p').should('have.text', 'Technology = Product/service/method/system/technology/solution etc. The “thing”, or tangible realization of the idea, that you want to develop.');
        //     cy.get('.readiness-level-rank > h3').should('be.visible');
        //     cy.get('.readiness-level-rank > h3').should('have.text', 'Rang : 9');
        //     cy.get('.readiness-level-comment > p').should('be.visible');
        //     cy.get('.readiness-level-comment > p').should('have.text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod.');
        // });

        it('Clicking on the Info Button display the Short & Long Description of the current RL rank', () => {
            cy.get('.readiness-level-rank > .mat-icon').click();
            cy.get('.title-close-component > h2').should('be.visible');
            cy.get('.title-close-component > h2').should('have.text', 'First commercial sales and implemented sales process. Substancial numer of active users.');
            cy.get(':nth-child(1) > .mat-mdc-cell').should('be.visible');
            cy.get(':nth-child(1) > .mat-mdc-cell').should('have.text', ' Market ready product/service sold to customers at/near target market price ');
            cy.get(':nth-child(2) > .mat-mdc-cell').should('be.visible');
            cy.get(':nth-child(2) > .mat-mdc-cell').should('have.text', ' Substantial number of active users of market ready product/service (initial customer traction) ');
            cy.get(':nth-child(3) > .mat-mdc-cell').should('be.visible');
            cy.get(':nth-child(3) > .mat-mdc-cell').should('have.text', ' Sales/user acquisition process implemented with dedicated people and support systems (CRM system, etc.) ');
            cy.get(':nth-child(4) > .mat-mdc-cell').should('be.visible');
            cy.get(':nth-child(4) > .mat-mdc-cell').should('have.text', ' Agreements in place with first partners to reach customers (when relevant) ');

            cy.get('.close-button-login > .mat-mdc-button-touch-target').click();
        });

        // // Test that uses labels & ranks coordinates to click on the graph (Has issues due to window size)
        // it('Checking click on label, rank & Info Button for each RL', () => {

        //     for (let i = 0; i < labels.length; i++) {
        //         cy.get('canvas').then($canvas => {
        //             cy.wrap($canvas)
        //                 .trigger('mousemove', ranks[i][0], ranks[i][1]).trigger('mouseover')
        //                 .click(ranks[i][0], ranks[i][1], { force: true });
        //         });

        //         cy.get('h2').should('be.visible');
        //         cy.get('h2').should('have.text', database.readiness_levels[5 - i].name);
        //         cy.get('.readiness-level-description > p').should('be.visible');
        //         cy.get('.readiness-level-description > p').should('have.text', database.readiness_levels[5 - i].description);


        //         cy.get('.readiness-level-rank > h3').should('have.text', 'Rang : ' + database.projects[0].assessments[2].readinessLevelRanks[5 - i].rank);
        //         cy.get('.readiness-level-comment > p').should('have.text', database.projects[0].assessments[2].readinessLevelRanks[5 - i].comment);


        //         cy.get('.readiness-level-rank > .mat-icon').click();
        //         cy.get('.title-close-component > h2').should('have.text', database.readiness_levels[5 - i].levels[database.projects[0].assessments[2].readinessLevelRanks[5 - i].rank - 1].shortDescription);
        //         for (let j = 0; j < database.readiness_levels[5 - i].levels[database.projects[0].assessments[2].readinessLevelRanks[5 - i].rank - 1].longDescription.length; j++) {
        //             cy.get(':nth-child(' + (j + 1) + ') > .mat-mdc-cell').should('have.text', ' ' + database.readiness_levels[5 - i].levels[database.projects[0].assessments[2].readinessLevelRanks[5 - i].rank - 1].longDescription[j] + ' ');
        //         }
        //         cy.get('.close-button-login > .mat-mdc-button-touch-target').click();

        //     }

        //     for (let i = 0; i < labels.length; i++) {
        //         cy.get('canvas').then($canvas => {
        //             cy.wrap($canvas)
        //                 .click(labels[i][0], labels[i][1]);
        //         })

        //         cy.get('h2').should('be.visible');
        //         cy.get('h2').should('have.text', database.readiness_levels[5 - i].name);
        //         cy.get('.readiness-level-description > p').should('be.visible');
        //         cy.get('.readiness-level-description > p').should('have.text', database.readiness_levels[5 - i].description);


        //         cy.get('.readiness-level-rank > h3').should('have.text', 'Rang : ' + database.projects[0].assessments[2].readinessLevelRanks[5 - i].rank);
        //         cy.get('.readiness-level-comment > p').should('have.text', database.projects[0].assessments[2].readinessLevelRanks[5 - i].comment);
        //     }
        // });

    });

    context("US : XRLO-146 As an Admin, I could be able to delete an assessment", () => {

        it('Delete the latest Assessment success', () => {
            cy.get('.left-toolbar > .ng-star-inserted > .mdc-button > .mat-mdc-button-touch-target').should('be.visible');
            cy.get('.left-toolbar > .ng-star-inserted > .mdc-button > .mat-mdc-button-touch-target').click();
            cy.get('#mat-mdc-dialog-title-0').should('be.visible');
            cy.get('#mat-mdc-dialog-title-0').should('have.text', 'Êtes-vous sûr de vouloir supprimer l\'évaluation à cette date ?');
            cy.get('.delete-content > p').should('be.visible');
            cy.get('.delete-content > p').should('have.text', '27/08/2023');
            cy.get('#confirm > .mdc-button__label').click();
            cy.get('.date').should('have.text', ' 27/08/2022 ');
        });

        it('Delete an old Assessment success', () => {
            cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();
            cy.get('.left-toolbar > .ng-star-inserted > .mdc-button > .mat-mdc-button-touch-target').click();
            cy.get('.delete-content > p').should('have.text', '27/08/2022');
            cy.get('#confirm > .mdc-button__label').click();
            cy.get('.date').should('have.text', ' 27/08/2021 ');
        });

        it('Delete an Assessment hidden for User not admin', () => {
            cy.PerformLogout();
            cy.PerformLogin("duboisj");
            cy.GoToPage("projects");
            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > h2').click();
            cy.get('.toolbar').should('have.text', 'addeditcompare_arrowsinsert_drive_file');
        });

        it('Delete an Assessment disabled for First Assessment', () => {
            cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();
            cy.get('.mat-mdc-paginator-navigation-previous > .mat-mdc-button-touch-target').click();
            cy.get('.left-toolbar > .ng-star-inserted').should('have.class', 'mat-mdc-tooltip-trigger');
        });

    });
});