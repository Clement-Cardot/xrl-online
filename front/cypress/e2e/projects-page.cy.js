describe('Projects Page tests', () => {

    let database;

    beforeEach(() => {
        cy.task('Seed_DB').then((result) => {
            database = result;
        });
    })

    beforeEach(() => {
        cy.visit('/');
        cy.changeLang('fr');
        cy.PerformLogin('admin');
        cy.GoToPage('projects')
    })

    context('US : XRLO-15 As an Admin, I must be able to create a new Project', () => {

        it('Create a new Project success', () => {
            cy.addNewProject('project-name', database.teams[0].name, database.business_lines[0].name, "description");
        });

        it('Create a new Project with a name already used', () => {
            // Intercept api call
            cy.intercept({
                method: 'POST',
                url: '/api/projects/create-project',
            }).as('apiCreateProject');

            /* Create new Project */
            cy.get('.add-container > button').click();
            cy.get('#project-name-input').clear();
            cy.get('#project-name-input').type(database.projects[0].name);
            cy.get('#team-name-input').clear();
            cy.get('#team-name-input').type(database.teams[0].name);
            cy.get('#business-line-name-input').click({ force: true });
            cy.get('#business-line-name-input').clear();
            cy.get('#business-line-name-input').type(database.business_lines[0].name);
            cy.get('#description-input').click({ force: true });
            cy.get('#description-input').clear();
            cy.get('#description-input').type("description");
            cy.get('#confirm').click();

            // Check api response
            cy.wait('@apiCreateProject').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(409);
                } else {
                    throw new Error('interception.response is undefined');
                }
            });

            // Check error message
            cy.get('#project-name-mat-error').should('be.visible');
            cy.get('#project-name-mat-error').should('have.text', "Ce nom de projet existe déjà");
        });

        it('Create a new Project with empty fields', () => {
            cy.get('.add-container > button').click();
            cy.get('#confirm').click();

            // Check error message
            cy.get('#project-name-mat-error').should('be.visible');
            cy.get('#project-name-mat-error').should('have.text', "Le nom du projet est requis");
            cy.get('#team-name-mat-error').should('be.visible');
            cy.get('#team-name-mat-error').should('have.text', "Une équipe est requise");
            cy.get('#business-line-name-mat-error').should('be.visible');
            cy.get('#business-line-name-mat-error').should('have.text', "Un secteur d'activité est requis");
        });

        it('Create a new Project with invalid team name and business line name', () => {
            cy.get('.add-container > button').click();
            cy.get('#project-name-input').clear();
            cy.get('#project-name-input').type('project-name');
            cy.get('#team-name-input').clear();
            cy.get('#team-name-input').type('invalid-team-name');
            cy.get('#business-line-name-input').click({ force: true });
            cy.get('#business-line-name-input').clear();
            cy.get('#business-line-name-input').type('invalid-business-line-name');
            cy.get('#description-input').click({ force: true });
            cy.get('#description-input').clear();
            cy.get('#description-input').type("description");
            cy.get('#confirm').click();

            // Check error message
            cy.get('#team-name-mat-error').should('be.visible');
            cy.get('#team-name-mat-error').should('have.text', "Cette équipe n'existe pas");
            cy.get('#business-line-name-mat-error').should('be.visible');
            cy.get('#business-line-name-mat-error').should('have.text', "Ce secteur d'activité n'existe pas");
        });
    })

    context('US : XRLO-17 As an Admin, I must be able to modify a Project', () => {

        it('Modify a Project success', () => {
            cy.updateProject(database.projects[0]._id, 'new-project-name', database.teams[0].name, database.business_lines[0].name, "description");
        });

        it('Modify a Project with a name already used', () => {
            cy.addNewProject('project-name', database.teams[0].name, database.business_lines[0].name, "description");

            // Intercept api call
            cy.intercept({
                method: 'PUT',
                url: '/api/projects/update-project',
            }).as('apiUpdateProject');

            /* Update new Project */
            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > .project-actions-buttons > #modify').click({ force: true });
            cy.wait(100)
            cy.get('#project-name-input').focus().clear();
            cy.get('#project-name-input').type("project-name");
            cy.get('#team-name-input').focus().clear();
            cy.get('#team-name-input').type(database.teams[0].name);
            cy.get('#business-line-name-input').click({ force: true });
            cy.get('#business-line-name-input').focus().clear();
            cy.get('#business-line-name-input').type(database.business_lines[0].name);
            cy.get('#description-input').click({ force: true });
            cy.get('#description-input').focus().clear();
            cy.get('#description-input').type("description");
            cy.get('#confirm').click();

            // Check api response
            cy.wait('@apiUpdateProject').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(409);
                } else {
                    throw new Error('interception.response is undefined');
                }
            });

            // Check error message
            cy.get('#project-name-mat-error').should('be.visible');
            cy.get('#project-name-mat-error').should('have.text', "Ce nom de projet existe déjà");
        });

        it('Modify a Project with empty fields', () => {

            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > .project-actions-buttons > #modify').click({ force: true });
            cy.wait(100)
            cy.get('#project-name-input').focus().clear();
            cy.get('#team-name-input').focus().clear();
            cy.get('#business-line-name-input').click({ force: true });
            cy.get('#business-line-name-input').focus().clear();
            cy.get('#description-input').click({ force: true });
            cy.get('#description-input').focus().clear();
            cy.get('#confirm').click();

            // Check error message
            cy.get('#project-name-mat-error').should('be.visible');
            cy.get('#project-name-mat-error').should('have.text', "Le nom du projet est requis");
            cy.get('#team-name-mat-error').should('be.visible');
            cy.get('#team-name-mat-error').should('have.text', "Une équipe est requise");
            cy.get('#business-line-name-mat-error').should('be.visible');
            cy.get('#business-line-name-mat-error').should('have.text', "Un secteur d'activité est requis");
        });

        it('Modify a Project with invalid team name and business line name', () => {

            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > .project-actions-buttons > #modify').click({ force: true });
            cy.wait(100)
            cy.get('#project-name-input').focus().clear();
            cy.get('#project-name-input').type('new-project-name');
            cy.get('#team-name-input').focus().clear();
            cy.get('#team-name-input').type('invalid-team-name');
            cy.get('#business-line-name-input').click({ force: true });
            cy.get('#business-line-name-input').focus().clear();
            cy.get('#business-line-name-input').type('invalid-business-line-name');
            cy.get('#description-input').click({ force: true });
            cy.get('#description-input').focus().clear();
            cy.get('#description-input').type("description");
            cy.get('#confirm').click();

            // Check error message
            cy.get('#team-name-mat-error').should('be.visible');
            cy.get('#team-name-mat-error').should('have.text', "Cette équipe n'existe pas");
            cy.get('#business-line-name-mat-error').should('be.visible');
            cy.get('#business-line-name-mat-error').should('have.text', "Ce secteur d'activité n'existe pas");
        });
    });

    context('US : XRLO-16 As an Admin, I must be able to delete a project', () => {

        it('Delete a Project success', () => {
            cy.deleteProject(database.projects[0]._id);
        });
    });

    context('US : XRLO-104 As a User, I must be able to create a new Project with Teams I am linked with', () => {

        it('Team in list are only the Teams linked with the current User', () => {

            cy.PerformLogout();
            cy.PerformLogin('duboisj');
            cy.GoToPage('projects')

            cy.get('.add-container > button').click();
            cy.get('#team-name-input').click();

            cy.get('.mat-mdc-option:first').should('have.text', ' Team2 ')
            cy.get('.mat-mdc-option:first').next().should('have.text', ' Team4 ');
        });

        it('Create a new Project success', () => {

            cy.PerformLogout();
            cy.PerformLogin('duboisj');
            cy.GoToPage('projects')

            cy.addNewProject('project-name', database.teams[3].name, database.business_lines[0].name, "description");
        });

        it('Create a new Project with Team not linked with current User', () => {

            cy.PerformLogout();
            cy.PerformLogin('duboisj');
            cy.GoToPage('projects')

            cy.get('.add-container > button').click();
            cy.get('#project-name-input').clear();
            cy.get('#project-name-input').type("ProjectTest");
            cy.get('#team-name-input').clear();
            cy.get('#team-name-input').type(database.teams[0].name);
            cy.get('#business-line-name-input').click({ force: true });
            cy.get('#business-line-name-input').clear();
            cy.get('#business-line-name-input').type(database.business_lines[1].name);
            cy.get('#description-input').click({ force: true });
            cy.get('#description-input').clear();
            cy.get('#description-input').type("description");
            cy.get('#confirm').click();

            cy.get('#team-name-mat-error').should('be.visible');
            cy.get('#team-name-mat-error').should('have.text', 'Équipe non autorisée');
        });

    });

    context('US : XRLO-103 As a User, I must be able to modify projects in which I am involved (Name, Description, BL)', () => {

        it('Modify a Project success', () => {

            cy.PerformLogout();
            cy.PerformLogin('cardotcl');
            cy.GoToPage('projects')

            cy.updateProject(database.projects[0]._id, 'new-project-name', null, database.business_lines[0].name, "description");
        });

        it('Delete Button is hidden', () => {

            cy.PerformLogout();
            cy.PerformLogin('cardotcl');
            cy.GoToPage('projects')

            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > .project-actions-buttons > #delete').should('not.exist');
        });

    });

    context('US : XRLO-137 As a User, I should be able to filter the Projects to only display the Projects I am linked with', () => {

        let idProjectNonLie;
        let idProjectLie3;

        beforeEach(() => {
            cy.addNewProject('Project 3', database.teams[0].name, database.business_lines[0].name, "description").then((value) => {
                idProjectLie3 = value;
            });
            cy.addNewProject('Project non lié', database.teams[1].name, database.business_lines[0].name, "description").then((value) => {
                idProjectNonLie = value;
            });
        })

        it('Only show the team of the current user', () => {

            cy.get('.filter-my-projects > mat-label').should('be.visible');
            cy.get('.filter-my-projects > mat-label').should('have.text', 'Uniquement mes projets');

            cy.get(`#project-card-${idProjectNonLie} > .card > .front > .content > .card-header > h2`).should('be.visible');
            cy.get(`#project-card-${idProjectNonLie} > .card > .front > .content > .card-header > h2`).should('have.text', 'Project non lié');

            cy.get('#mat-mdc-checkbox-1-input').check();

            cy.get(`#project-card-${idProjectNonLie} > .card > .front > .content > .card-header > h2`).should('not.exist');
        });

        it('Only show the team of the current user and apply filter', () => {
            cy.get(`#project-card-${idProjectNonLie} > .card > .front > .content > .card-header > h2`).should('be.visible');
            cy.get(`#project-card-${idProjectNonLie} > .card > .front > .content > .card-header > h2`).should('have.text', 'Project non lié');

            cy.get(`#project-card-${idProjectLie3} > .card > .front > .content > .card-header > h2`).should('be.visible');
            cy.get(`#project-card-${idProjectLie3} > .card > .front > .content > .card-header > h2`).should('have.text', 'Project 3');

            cy.get('#mat-mdc-checkbox-1-input').check();
            cy.get('#mat-input-1').clear();
            cy.get('#mat-input-1').type('1');

            cy.get(`#project-card-${idProjectNonLie} > .card > .front > .content > .card-header > h2`).should('not.exist');
            cy.get(`#project-card-${idProjectLie3} > .card > .front > .content > .card-header > h2`).should('not.exist');

            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > h2').should('be.visible');
            cy.get('#project-card-' + database.projects[0]._id + ' > .card > .front > .content > .card-header > h2').should('have.text', 'Project 1');
        });

    });
})
