describe('Project Page tests', () => {

    let database;

    beforeEach(() => {
        cy.task('Seed_DB').then((result) => {
            database = result;
        });
    })

    beforeEach(() => {
      cy.visit('/');
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
            cy.get('#business-line-name-input').click({force: true});
            cy.get('#business-line-name-input').clear();
            cy.get('#business-line-name-input').type(database.business_lines[0].name);
            cy.get('#description-input').click({force: true});
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
            cy.get('#business-line-name-input').click({force: true});
            cy.get('#business-line-name-input').clear();
            cy.get('#business-line-name-input').type('invalid-business-line-name');
            cy.get('#description-input').click({force: true});
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
            cy.get('#project-card-'+database.projects[0]._id+' > .card > .front > .content > .card-header > .project-actions-buttons > #modify').click({ force: true });
            cy.wait(100)
            cy.get('#project-name-input').focus().clear();
            cy.get('#project-name-input').type("project-name");
            cy.get('#team-name-input').focus().clear();
            cy.get('#team-name-input').type(database.teams[0].name);
            cy.get('#business-line-name-input').click({force: true});
            cy.get('#business-line-name-input').focus().clear();
            cy.get('#business-line-name-input').type(database.business_lines[0].name);
            cy.get('#description-input').click({force: true});
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

            cy.get('#project-card-'+database.projects[0]._id+' > .card > .front > .content > .card-header > .project-actions-buttons > #modify').click({ force: true });
            cy.wait(100)
            cy.get('#project-name-input').focus().clear();
            cy.get('#team-name-input').focus().clear();
            cy.get('#business-line-name-input').click({force: true});
            cy.get('#business-line-name-input').focus().clear();
            cy.get('#description-input').click({force: true});
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

            cy.get('#project-card-'+database.projects[0]._id+' > .card > .front > .content > .card-header > .project-actions-buttons > #modify').click({ force: true });
            cy.wait(100)
            cy.get('#project-name-input').focus().clear();
            cy.get('#project-name-input').type('new-project-name');
            cy.get('#team-name-input').focus().clear();
            cy.get('#team-name-input').type('invalid-team-name');
            cy.get('#business-line-name-input').click({force: true});
            cy.get('#business-line-name-input').focus().clear();
            cy.get('#business-line-name-input').type('invalid-business-line-name');
            cy.get('#description-input').click({force: true});
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
})