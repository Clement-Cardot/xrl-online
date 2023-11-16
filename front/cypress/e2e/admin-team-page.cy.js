describe("Admin Team Page tests", () => {
  let database;

  beforeEach(() => {
    cy.task("Seed_DB").then((result) => {
      database = result;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.PerformLogin("admin");
    cy.GoToPage("admin-teams");
  });

  context("US : XRLO-25 As an Admin, I must be able to create a new User", () => {
      it("Create a new User success", () => {
        cy.addNewUser(
          "new_user_login",
          "new_user_firstname",
          "new_user_lastname"
        );
      });

      it("Create a new User login already used", () => {
        // Intercept api call
        cy.intercept({
          method: "POST",
          url: "/api/users/create-user",
        }).as("apiCreateUser");

        // Create new user
        cy.get("#addUserBtn").click();
        cy.get("#mat-input-2").type(database.users[1].firstName);
        cy.get("#mat-input-3").type(database.users[1].lastName);
        cy.get("#mat-input-4").type(database.users[1].login);
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check api response
        cy.wait("@apiCreateUser").then((interception) => {
          if (interception.response) {
            expect(interception.response.statusCode).to.eq(409);
          } else {
            throw new Error("interception.response is undefined");
          }
        });

        // Check error message
        cy.get("#mat-mdc-error-3").should(
          "have.text",
          "Cet identifiant existe déjà"
        );
        cy.get("#mat-mdc-error-3").should("be.visible");
      });

      it("Create a new User login null", () => {
        // Create new user
        cy.get("#addUserBtn").click();
        cy.get("#mat-input-2").type("Jean");
        cy.get("#mat-input-3").type("Durant");
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check error message
        cy.get("#mat-mdc-error-3").should(
          "have.text",
          "Un identifiant est requis"
        );
        cy.get("#mat-mdc-error-3").should("be.visible");
      });

      it("Create a new User firstname null", () => {
        // Create new user
        cy.get("#addUserBtn").click();
        cy.get("#mat-input-3").type("Durant");
        cy.get("#mat-input-4").type("durantj");
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check error message
        cy.get("#mat-mdc-error-1").should("have.text", "Un prénom est requis");
        cy.get("#mat-mdc-error-1").should("be.visible");
      });

      it("Create a new User lastname null", () => {
        // Create new user
        cy.get("#addUserBtn").click();
        cy.get("#mat-input-2").type("Jean");
        cy.get("#mat-input-4").type("durantj");
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check error message
        cy.get("#mat-mdc-error-2").should("have.text", "Un nom est requis");
        cy.get("#mat-mdc-error-2").should("be.visible");
      });
    }
  );

  context("US : XRLO-26 As an Admin, I could be able to modify an existing User", () => {
      it("Modify an existing User success", () => {
        cy.modifyExistingUser(
          database.users[1].login,
          database.users[1].login + "_test",
          database.users[1].firstName + "_test",
          database.users[1].lastName + "_test"
        );
      });

      it("Modify an existing User login already exists", () => {
        // Intercept api call
        cy.intercept({
          method: "PUT",
          url: "/api/users/update-user",
        }).as("apiModifyUser");

        // Trigger mouseenter event to display actions buttons
        cy.get("#list-users-actions-" + database.users[1].login).trigger(
          "mouseenter",
          { force: true }
        );

        // Click on modify button
        cy.get(
          "#list-users-actions-" +
            database.users[1].login +
            " > :nth-child(1) > .mat-icon"
        ).click();

        // Clear input of Modify user dialog
        cy.get("#mat-input-2").clear();
        cy.get("#mat-input-3").clear();
        cy.get("#mat-input-4").clear();

        // Enter new values (test2_user...)
        cy.get("#mat-input-2").type(database.users[1].firstName + "_test");
        cy.get("#mat-input-3").type(database.users[1].lastName + "_test");
        cy.get("#mat-input-4").type(database.users[2].login);

        // Click on save button
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check api response
        cy.wait("@apiModifyUser").then((interception) => {
          if (interception.response) {
            expect(interception.response.statusCode).to.eq(409);
          } else {
            throw new Error("interception.response is undefined");
          }
        });

        // Check error message
        cy.get("#mat-mdc-error-3").should(
          "have.text",
          "Cet identifiant existe déjà"
        );
        cy.get("#mat-mdc-error-3").should("be.visible");
      });

      it("Modify an existing User login null", () => {
        // Trigger mouseenter event to display actions buttons
        cy.get("#list-users-actions-" + database.users[1].login).trigger(
          "mouseenter",
          { force: true }
        );

        // Click on modify button
        cy.get(
          "#list-users-actions-" +
            database.users[1].login +
            " > :nth-child(1) > .mat-icon"
        ).click();

        // Clear input of Modify user dialog
        cy.get("#mat-input-2").clear();
        cy.get("#mat-input-3").clear();
        cy.get("#mat-input-4").clear();

        // Enter new values (test2_user...)
        cy.get("#mat-input-2").type(database.users[1].firstName + "_test");
        cy.get("#mat-input-3").type(database.users[1].lastName + "_test");

        // Click on save button
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check error message
        cy.get("#mat-mdc-error-3").should(
          "have.text",
          "Un identifiant est requis"
        );
        cy.get("#mat-mdc-error-3").should("be.visible");
      });

      it("Modify an existing User firstname null", () => {
        // Trigger mouseenter event to display actions buttons
        cy.get("#list-users-actions-" + database.users[1].login).trigger(
          "mouseenter",
          { force: true }
        );

        // Click on modify button
        cy.get(
          "#list-users-actions-" +
            database.users[1].login +
            " > :nth-child(1) > .mat-icon"
        ).click();

        // Clear input of Modify user dialog
        cy.get("#mat-input-2").clear();
        cy.get("#mat-input-3").clear();
        cy.get("#mat-input-4").clear();

        // Enter new values (test2_user...)
        cy.get("#mat-input-3").type(database.users[1].lastName + "_test");
        cy.get("#mat-input-4").type(database.users[2].login);

        // Click on save button
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check error message
        cy.get("#mat-mdc-error-1").should("have.text", "Un prénom est requis");
        cy.get("#mat-mdc-error-1").should("be.visible");
      });

      it("Modify an existing User lastname null", () => {
        // Trigger mouseenter event to display actions buttons
        cy.get("#list-users-actions-" + database.users[1].login).trigger(
          "mouseenter",
          { force: true }
        );

        // Click on modify button
        cy.get(
          "#list-users-actions-" +
            database.users[1].login +
            " > :nth-child(1) > .mat-icon"
        ).click();

        // Clear input of Modify user dialog
        cy.get("#mat-input-2").clear();
        cy.get("#mat-input-3").clear();
        cy.get("#mat-input-4").clear();

        // Enter new values (test2_user...)
        cy.get("#mat-input-2").type(database.users[1].firstName + "_test");
        cy.get("#mat-input-4").type(database.users[2].login);

        // Click on save button
        cy.get(
          ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
        ).click();

        // Check error message
        cy.get("#mat-mdc-error-2").should("have.text", "Un nom est requis");
        cy.get("#mat-mdc-error-2").should("be.visible");
      });
    }
  );

  context("US : XRLO-27 As an Admin, I could be able to delete an existing User", () => {
      it("Delete an existing User success", () => {
        cy.deleteExistingUser(database.users[1].login);
      });

      it('Delete an existing User close dialog with "No" button', () => {
        // Trigger mouseenter event to display actions buttons
        cy.get("#list-users-actions-" + database.users[1].login).trigger(
          "mouseenter",
          { force: true }
        );

        // Click on delete button
        cy.get(
          "#list-users-actions-" +
            database.users[1].login +
            " > :nth-child(2) > .mat-icon"
        ).click();

        // Click on "No" button
        cy.get('.close-button > .mdc-button__label').click();

        // Check User still in list
        cy.get("#list-users-actions-" + database.users[1].login).should(
          "exist"
        );
      });

      it("Delete an existing User close dialog by clicking outside the dialog", () => {
        // Trigger mouseenter event to display actions buttons
        cy.get("#list-users-actions-" + database.users[1].login).trigger(
          "mouseenter",
          { force: true }
        );

        // Click on delete button
        cy.get(
          "#list-users-actions-" +
            database.users[1].login +
            " > :nth-child(2) > .mat-icon"
        ).click();

        // Click outside the dialog
        cy.get(".cdk-overlay-backdrop").click({ force: true });

        // Check dialog has been closed
        cy.get(".cdk-overlay-backdrop").should("not.exist");

        // Check User still in list
        cy.get("#list-users-actions-" + database.users[1].login).should(
          "exist"
        );
      });
    }
  );

  context("US : XRLO-18 As an Admin, I must be able to create a team", () => {
    it("Create team successfully", () => {
      // Intercept api call
      cy.intercept({
        method: "POST",
        url: "/api/teams/create-team",
      }).as("apiCreateTeam");

      // Click on create team button
      cy.get(".mat-mdc-card > .mat-icon").click();
      // Enter team name
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("New Team");
      // Add members
      cy.get("#user-list-actions-cardotcl > button > .mat-icon").click();
      cy.get("#user-list-actions-duboisj > button > .mat-icon").click();
      cy.get("#user-list-actions-dupontp > button > .mat-icon").click();
      cy.get("#user-list-actions-durandm > button > .mat-icon").click();
      // Click on save button
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait("@apiCreateTeam").then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(200);
        } else {
          throw new Error("interception.response is undefined");
        }
      });

      // Check success message
      cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should(
        "have.text",
        " L'équipe a été créée avec succès\n"
      );
      // Check team has been created
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title"
      ).should("have.text", "New Team");
      // Check team members
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-content > .mat-mdc-table > .mdc-data-table__content > :nth-child(1) > .firstNameCell"
      ).should("have.text", " Clément ");
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-content > .mat-mdc-table > .mdc-data-table__content > :nth-child(1) > .cdk-column-lastName"
      ).should("have.text", "Cardot");
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-content > .mat-mdc-table > .mdc-data-table__content > :nth-child(2) > .firstNameCell"
      ).should("have.text", " Jean ");
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-content > .mat-mdc-table > .mdc-data-table__content > :nth-child(2) > .cdk-column-lastName"
      ).should("have.text", "Dubois");
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-content > .mat-mdc-table > .mdc-data-table__content > :nth-child(3) > .firstNameCell"
      ).should("have.text", " Pierre ");
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-content > .mat-mdc-table > .mdc-data-table__content > :nth-child(3) > .cdk-column-lastName"
      ).should("have.text", "Dupont");
    });

    it("Create team, name is too short", () => {
      // Click on create team button
      cy.get(".mat-mdc-card > .mat-icon").click();
      // Enter short team name
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("az");
      // Add members
      cy.get("#user-list-actions-duboisj > button > .mat-icon").click();
      cy.get("#user-list-actions-durandm > button > .mat-icon").click();
      cy.get("#user-list-actions-richardt > button > .mat-icon").click();
      // Check error message
      cy.get("#mat-mdc-error-1").should(
        "have.text",
        "Le nom de l'équipe doit contenir au moins 3 caractères"
      );
    });

    it("Create team, name is too long", () => {
      // Click on create team button
      cy.get(".mat-mdc-card > .mat-icon").click();
      // Enter long team name
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("azertyuiopqsdfghjklmwxcvbn");
      // Add members
      cy.get("#user-list-actions-dupontp > button > .mat-icon").click();
      cy.get("#user-list-actions-durandm > button > .mat-icon").click();
      cy.get("#user-list-actions-martinj > button > .mat-icon").click();
      // Check error message
      cy.get("#mat-mdc-error-2").should(
        "have.text",
        "Le nom de l'équipe ne doit pas dépasser 20 caractères"
      );
    });

    it("Create team, no name", () => {
      // Click on create team button
      cy.get(".mat-mdc-card > .mat-icon").click();
      // Add members
      cy.get("#user-list-actions-duboisj > button > .mat-icon").click();
      cy.get("#user-list-actions-dupontp > button > .mat-icon").click();
      cy.get("#user-list-actions-durandm > button > .mat-icon").click();
      // Check error message
      cy.get("#mat-mdc-error-1").should(
        "have.text",
        "Le nom de l'équipe est requis"
      );
    });

    it("create team, no members", () => {
      // Intercept api call
      cy.intercept({
        method: "POST",
        url: "/api/teams/create-team",
      }).as("apiCreateTeam");

      // Click on create team button
      cy.get(".mat-mdc-card > .mat-icon").click();
      // Enter team name
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("New Team");
      // Click on save button
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait("@apiCreateTeam").then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(200);
        } else {
          throw new Error("interception.response is undefined");
        }
      });

      // Check new team has been created
      cy.get(
        ":nth-child(6) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title"
      ).should("have.text", "New Team");
    });

    it("create team, name already exists", () => {
      // Intercept api call
      cy.intercept({
        method: "POST",
        url: "/api/teams/create-team",
      }).as("apiCreateTeam");

      // Click on create team button
      cy.get(".mat-mdc-card > .mat-icon").click();
      // Enter team name already exists
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("Team2");
      // Click on save button
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait("@apiCreateTeam").then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(409);
        } else {
          throw new Error("interception.response is undefined");
        }
      });

      // Check error message
      cy.get("#mat-mdc-error-2").should(
        "have.text",
        "Ce nom d'équipe existe déjà"
      );
    });
  });

  context("US : XRLO-19 As an Admin, I must be able to delete a team", () => {
    it("delete team", () => {
      // Click on delete team button
      cy.get(
        ":nth-child(2) > .mat-mdc-card > .mat-mdc-card-header > .icons-container > :nth-child(2)"
      ).click();
      cy.get(
        ".mat-mdc-dialog-actions > :nth-child(2) > .mdc-button__label"
      ).click();
    });
  });

  context("US : XRLO-20 As an Admin, I must be able to modify a team", () => {
    it("update team name", () => {
      // Intercept api call
      cy.intercept({
        method: "PUT",
        url: "/api/teams/update-team",
      }).as("apiUpdateTeam");

      // Click on update team button
      cy.get(
        ":nth-child(2) > .mat-mdc-card > .mat-mdc-card-header > .icons-container > :nth-child(1)"
      ).click();
      // Enter new team name
      cy.get(".edit-name-container").click();
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("Team 1 BIS");
      // Click on save button
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait("@apiUpdateTeam").then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(200);
        } else {
          throw new Error("interception.response is undefined");
        }
      });

      // Check success message
      cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should(
        "have.text",
        " L'équipe a été mise à jour avec succès\n"
      );
      // Check team name has been updated
      cy.get(
        ":nth-child(2) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title"
      ).should("have.text", "Team 1 BIS");
    });

    it("update team, remove members", () => {
      // Intercept api call
      cy.intercept({
        method: "PUT",
        url: "/api/teams/update-team",
      }).as("apiUpdateTeam");

      // Click on update team button
      cy.get(
        ":nth-child(3) > .mat-mdc-card > .mat-mdc-card-header > .icons-container > :nth-child(1)"
      ).click();
      // Remove members
      cy.get("#user-list-actions-martinj > button > .mat-icon").click();
      cy.get("#user-list-actions-durandm > button > .mat-icon").click();
      // Click on save button
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait("@apiUpdateTeam").then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(200);
        } else {
          throw new Error("interception.response is undefined");
        }
      });

      // Check success message
      cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should(
        "have.text",
        " L'équipe a été mise à jour avec succès\n"
      );
    });

    it("update team, add members", () => {
      // Intercept api call
      cy.intercept({
        method: "PUT",
        url: "/api/teams/update-team",
      }).as("apiUpdateTeam");

      // Click on update team button
      cy.get(
        ":nth-child(4) > .mat-mdc-card > .mat-mdc-card-header > .icons-container > :nth-child(1)"
      ).click();
      // Add members
      cy.get("#user-list-actions-dupontp > button > .mat-icon").click();
      cy.get("#user-list-actions-durandm > button > .mat-icon").click();
      cy.get("#user-list-actions-martinj > button > .mat-icon").click();
      // Click on save button
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait("@apiUpdateTeam").then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(200);
        } else {
          throw new Error("interception.response is undefined");
        }
      });

      // Check success message
      cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should(
        "have.text",
        " L'équipe a été mise à jour avec succès\n"
      );
    });

    it("update team, name already exists", () => {
      // Intercept api call
      cy.intercept({
        method: "PUT",
        url: "/api/teams/update-team",
      }).as("apiUpdateTeam");

      // Click on update team button
      cy.get(
        ":nth-child(3) > .mat-mdc-card > .mat-mdc-card-header > .icons-container > :nth-child(1)"
      ).click();
      // Enter team name already exists
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("Team1");
      // Click on save button
      cy.get('[ng-reflect-disabled="false"] > .mdc-button__label').click();

      // Check api response
      cy.wait("@apiUpdateTeam").then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.eq(409);
        } else {
          throw new Error("interception.response is undefined");
        }
      });

      // Check error message
      cy.get("#mat-mdc-error-2").should(
        "have.text",
        "Ce nom d'équipe existe déjà"
      );
    });

    it("update team, name too short", () => {
      // Click on update team button
      cy.get(
        ":nth-child(3) > .mat-mdc-card > .mat-mdc-card-header > .icons-container > :nth-child(1)"
      ).click();
      // Enter short team name
      cy.get(".edit-name-container").click();
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("az");
      // Click on save button
      cy.get("#user-list-actions-richardt > button > .mat-icon").click();
      // Check error message
      cy.get("#mat-mdc-error-1").should(
        "have.text",
        "Le nom de l'équipe doit contenir au moins 3 caractères"
      );
    });

    it("update team, name too long", () => {
      // Click on update team button
      cy.get(
        ":nth-child(3) > .mat-mdc-card > .mat-mdc-card-header > .icons-container > :nth-child(1)"
      ).click();
      // Enter long team name
      cy.get(".edit-name-container").click();
      cy.get("#mat-input-2").clear();
      cy.get("#mat-input-2").type("azertyuiopqsdfghjklmwxcvbn");
      // Click on save button
      cy.get("#user-list-actions-richardt > button > .mat-icon").click();
      // Check error message
      cy.get("#mat-mdc-error-2").should(
        "have.text",
        "Le nom de l'équipe ne doit pas dépasser 20 caractères"
      );
    });
  });
});
