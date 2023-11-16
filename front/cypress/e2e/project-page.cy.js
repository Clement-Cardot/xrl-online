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

            // Check api response
            cy.wait('@apiCreateProject').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body).to.have.all.keys('id', 'name', 'team', 'businessLine', 'description', 'assessments');
                } else {
                    throw new Error('interception.response is undefined');
                }
            })

            // Check SnackBar
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
            // TODO : to fix
            // cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Projet supprimé\n`);

            // Force Snack bar to disappear (performance)
            cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
        });

        it('Create a new Project with a name already used', () => {
            cy.addNewProject(database.projects[0].name, database.teams[0].name, database.business_lines[0].name, "description");

            // Check api response
            cy.wait('@apiCreateProject').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(409);
                } else {
                    throw new Error('interception.response is undefined');
                }
            });

            // Check error message
            cy.get('#mat-mdc-error-1').should('be.visible');
            cy.get('#mat-mdc-error-1').should('have.text', "Ce nom de projet existe déjà");
        });

        it('Create a new Project with empty fields', () => {
            cy.get('.search-add-container > .mdc-button > .mdc-button__label').click();
            cy.get('.primary-button > .mdc-button__label').click();

            // Check error message
            cy.get('#mat-mdc-error-1').should('be.visible');
            cy.get('#mat-mdc-error-1').should('have.text', "Le nom du projet est requis");
            cy.get('#mat-mdc-error-2').should('be.visible');
            cy.get('#mat-mdc-error-2').should('have.text', "Une équipe est requise");
            cy.get('#mat-mdc-error-3').should('be.visible');
            cy.get('#mat-mdc-error-3').should('have.text', "Un secteur d'activité est requis");
        });

        it('Create a new Project with invalid team name and business line name', () => {
            cy.addNewProject('project-name', 'invalid-team-name', 'invalid-business-line-name', "description");

            // Check error message
            cy.get('#mat-mdc-error-2').should('be.visible');
            cy.get('#mat-mdc-error-2').should('have.text', "Cette équipe n'existe pas");
            cy.get('#mat-mdc-error-3').should('be.visible');
            cy.get('#mat-mdc-error-3').should('have.text', "Ce secteur d'activité n'existe pas");
        });
    })

    context('US : XRLO-17 As an Admin, I must be able to modify a Project', () => {

        it('Modify a Project success', () => {
            cy.updateProject(database.projects[0]._id, 'new-project-name', database.teams[0].name, database.business_lines[0].name, "description");

            // Check api response
            cy.wait('@apiUpdateProject').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body).to.have.all.keys('id', 'name', 'team', 'businessLine', 'description', 'assessments');
                } else {
                    throw new Error('interception.response is undefined');
                }
            })

            // Check SnackBar
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
            // TODO : to fix
            // cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Projet supprimé\n`);

            // Force Snack bar to disappear (performance)
            cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
        });

        //TODO : to fix
        it('Modify a Project with a name already used', () => {
            cy.addNewProject('project-name', database.teams[0].name, database.business_lines[0].name, "description");
            cy.updateProject(database.projects[0]._id, "project-name", database.teams[0].name, database.business_lines[0].name, "description");

            // Check api response
            cy.wait('@apiUpdateProject').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(409);
                } else {
                    throw new Error('interception.response is undefined');
                }
            });

            // Check error message
            cy.get('#mat-mdc-error-4').should('be.visible');
            cy.get('#mat-mdc-error-4').should('have.text', "Ce nom de projet existe déjà");
        });

        it('Modify a Project with empty fields', () => {
            cy.get('#project-item-' + database.projects[0]._id + ' > .flip-front > .project-actions-buttons > :nth-child(1)').click({force: true});
            cy.get('#name-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
            cy.get('#mat-input-2').clear();
            cy.get('#mat-input-3').clear();
            cy.get('#mat-input-4').clear();
            cy.get('#mat-input-5').clear();
            cy.get('.primary-button > .mdc-button__label').click();

            // Check error message
            cy.get('#mat-mdc-error-1').should('be.visible');
            cy.get('#mat-mdc-error-1').should('have.text', "Le nom du projet est requis");
            cy.get('#mat-mdc-error-2').should('be.visible');
            cy.get('#mat-mdc-error-2').should('have.text', "Une équipe est requise");
            cy.get('#mat-mdc-error-3').should('be.visible');
            cy.get('#mat-mdc-error-3').should('have.text', "Un secteur d'activité est requis");
        });

        it('Modify a Project with invalid team name and business line name', () => {
            cy.updateProject(database.projects[0]._id, 'new-project-name', 'invalid-team-name', 'invalid-business-line-name', "description");

            // Check error message
            cy.get('#mat-mdc-error-2').should('be.visible');
            cy.get('#mat-mdc-error-2').should('have.text', "Cette équipe n'existe pas");
            cy.get('#mat-mdc-error-3').should('be.visible');
            cy.get('#mat-mdc-error-3').should('have.text', "Ce secteur d'activité n'existe pas");
        });
    });

    context('US : XRLO-16 As an Admin, I must be able to delete a project', () => {

        it('Delete a Project success', () => {
            cy.deleteProject(database.projects[0]._id);

            // Check api response
            cy.wait('@apiDeleteProject').then((interception) => {
                if (interception.response) {
                    expect(interception.response.statusCode).to.eq(200);
                } else {
                    throw new Error('interception.response is undefined');
                }
            })

            // Check SnackBar
            cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible');
            // TODO : to fix
            // cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('have.text', ` Projet supprimé\n`);

            // Force Snack bar to disappear (performance)
            cy.get('.mat-mdc-snack-bar-action > .mdc-button__label').click();
        });
    });
})