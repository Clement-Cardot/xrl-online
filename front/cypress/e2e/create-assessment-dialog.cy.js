describe("Create Assessment dialog tests", () => {
    let database;

    beforeEach(() => {
        cy.task("Seed_DB").then((result) => {
            database = result;
        });
    });

    beforeEach(() => {
        cy.visit("/");
        cy.PerformLogin("admin");
        cy.GoToPage("projects");
    });

    context("US : XRLO-29 As a User, I must be able to create the first xRL assessment for a project", () => {

        let idProject;

        beforeEach(() => {
            cy.addNewProject("empty new project", database.teams[0].name, database.business_lines[0].name, "description").then((value) => {
                idProject = value;
            });
        })

        it("Create the first xRL", () => {
            // Open project page
            cy.get(`#project-card-${idProject} > .card > .front > .content > .card-header > h2`).click();

            // Intercept api call
            cy.intercept({
                method: 'GET',
                url: '/api/readiness-levels/get-all-readiness-levels',
            }).as('apiGetAllReadinessLevels');

            // Open create assessment dialog
            cy.get('.left-toolbar > div > #create').click();

            
            // Check api response to get ReadinessLevelIds
            cy.wait('@apiGetAllReadinessLevels').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body).to.have.length(6);

                    let readinessLevelIds = [];
                    interception.response.body.forEach(element => {
                        readinessLevelIds.push(element.id);
                    });

                    // Select 6 RLs
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[0]} > button`).click();
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[1]} > button`).click();
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[2]} > button`).click();
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[3]} > button`).click();
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[4]} > button`).click();
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[5]} > button`).click();

                } else {
                    throw new Error('interception.response is undefined');
                }
            });

            // Click on next button
            cy.get('#next-button-rl-choice').click();

            // Choose ReadinessLevelRank for each RL
            for (let i = 0; i < 6; i++) {
                cy.get(`.apexcharts-series > :nth-child(5)`).filter(':visible').click();
                cy.get(`#rankComment-input-${i}`).clear().type(`Comment ${i}`);
                cy.get(`#next-button-${i}`).click();
            }

            // Enter Comment & Tag
            cy.get('#comment-input').type('Global Comment');
            cy.get('#next-button-comment').click();


            // Intercept api call
            cy.intercept({
                method: 'POST',
                url: `/api/projects/add-new-assessment?projectId=${idProject}`,
            }).as('apiAddNewAssessment');

            // Confirm assessment creation
            cy.get('#confirm').click();

            // Check api response
            cy.wait('@apiAddNewAssessment').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body).to.have.all.keys('id', 'name', 'team', 'businessLine', 'description', 'assessments');
                    expect(interception.response.body.assessments).to.have.length(1);
                } else {
                    throw new Error('interception.response is undefined');
                }
            });
            
        });

        it("Must choose more than 3 RL", () => {
            // Open project page
            cy.get(`#project-card-${idProject} > .card > .front > .content > .card-header > h2`).click();

            // Intercept api call
            cy.intercept({
                method: 'GET',
                url: '/api/readiness-levels/get-all-readiness-levels',
            }).as('apiGetAllReadinessLevels');

            // Open create assessment dialog
            cy.get('.left-toolbar > div > #create').click();

            
            // Check api response to get ReadinessLevelIds
            cy.wait('@apiGetAllReadinessLevels').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body).to.have.length(6);

                    let readinessLevelIds = [];
                    interception.response.body.forEach(element => {
                        readinessLevelIds.push(element.id);
                    });

                    // Check error message visible
                    cy.get('#readiness-level-mat-error').should('have.text', 'Vous avez choisi moins de 3 niveaux de maturité');

                    // Select 3 RL
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[0]} > button`).click();
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[1]} > button`).click();
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[2]} > button`).click();

                    // Check error message not visible
                    cy.get('#readiness-level-mat-error').should('not.exist');

                    // Remove 1 RL
                    cy.get(`#readiness-level-list-actions-${readinessLevelIds[2]} > button`).click();

                    // Check error message visible
                    cy.get('#readiness-level-mat-error').should('have.text', 'Vous avez choisi moins de 3 niveaux de maturité');
                } else {
                    throw new Error('interception.response is undefined');
                }
            });
        });

        it("Must choose less than 10 RL", () => {
            // TODO: not enough RL in DB
        });
        
    });

    context("US : XRLO-30 As a User, I must be able to create a new assessment of an existing xRL for a project", () => {

        it("Create new xRL", () => {
            // Open project page
            cy.get(`#project-card-${database.projects[1]._id} > .card > .front > .content > .card-header > h2`).click();

            // Intercept api call
            cy.intercept({
                method: 'GET',
                url: '/api/readiness-levels/get-all-readiness-levels',
            }).as('apiGetAllReadinessLevels');

            // Open create assessment dialog
            cy.get('.left-toolbar > div > #create').click();

            
            // Check api response to get ReadinessLevelIds
            cy.wait('@apiGetAllReadinessLevels').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body).to.have.length(6);

                    let readinessLevelIds = [];
                    interception.response.body.forEach(element => {
                        readinessLevelIds.push(element.id);
                    });

                    // Select 6 RLs
                    // cy.get(`#readiness-level-list-actions-${readinessLevelIds[0]} > button > .mat-icon`).click();
                    // cy.get(`#readiness-level-list-actions-${readinessLevelIds[1]} > button > .mat-icon`).click();
                    // cy.get(`#readiness-level-list-actions-${readinessLevelIds[2]} > button > .mat-icon`).click();
                    // cy.get(`#readiness-level-list-actions-${readinessLevelIds[3]} > button > .mat-icon`).click();
                    // cy.get(`#readiness-level-list-actions-${readinessLevelIds[4]} > button > .mat-icon`).click();
                    // cy.get(`#readiness-level-list-actions-${readinessLevelIds[5]} > button > .mat-icon`).click();

                } else {
                    throw new Error('interception.response is undefined');
                }
            });

            // Click on next button
            cy.get('#next-button-rl-choice').click();

            // Choose ReadinessLevelRank for each RL
            for (let i = 0; i < 6; i++) {
                cy.get(`.apexcharts-series > :nth-child(5)`).filter(':visible').click();
                cy.get(`#rankComment-input-${i}`).clear().type(`Comment ${i}`);
                cy.get(`#next-button-${i}`).click();
            }

            // Enter Comment & Tag
            cy.get('#comment-input').type('Global Comment');
            cy.get('#next-button-comment').click();


            // Intercept api call
            cy.intercept({
                method: 'POST',
                url: `/api/projects/add-new-assessment?projectId=*`,
            }).as('apiAddNewAssessment');

            // Confirm assessment creation
            cy.get('#confirm').click();

            // Check api response
            cy.wait('@apiAddNewAssessment').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body).to.have.all.keys('id', 'name', 'team', 'businessLine', 'description', 'assessments');
                    expect(interception.response.body.assessments).to.have.length(2);
                } else {
                    throw new Error('interception.response is undefined');
                }
            });
            
        });

        it("Must choose more than 3 RL", () => {
            // TODO
        });

        it("Must choose less than 10 RL", () => {
            // TODO: not enough RL in DB
        });
        
    });
});