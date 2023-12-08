describe("Admin ReadinessLevel Page tests", () => {
  let database;

  beforeEach(() => {
    cy.task("Seed_DB").then((result) => {
      console.log(result);
      database = result;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.PerformLogin("admin");
    cy.GoToPage("admin-RL");
  });

  context("US : XRLO-23 As an Admin, I must be able to create a new ReadinessLevel", () => {
    
      let readinessLevelId;

      beforeEach(() => {
        readinessLevelId = database.readiness_levels[0]._id;
      });

      it("Create a new ReadinessLevel success", () => {
        cy.intercept({
          method: "POST",
          url: "/api/readiness-levels/create-readiness-level",
        }).as("apiCreateReadinessLevel");

        cy.get('.add-container > .mdc-button > .mdc-button__label').click();
        
        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("Nouveau Niveau");
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");

        
        // Enter short & long level's descriptions
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
        }

        //Click on the create button
        cy.get('#confirm').click();
        
        //Verify that the Api call is successful
        cy.wait("@apiCreateReadinessLevel").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
        });

        //Verify that the success message is displayed
        cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should("be.visible");
        cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should("have.text", " Le niveau de maturité a été créé avec succès\n");

        // Verify that the new ReadinessLevel is displayed
        cy.get(":nth-child(7) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").should("be.visible");
        cy.get(":nth-child(7) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").should("have.text", "Nouveau Niveau");

        // Open the new ReadinessLevel
        cy.get(":nth-child(7) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").click();

        // Verify that description, short and long level's descriptions are displayed
        cy.get("#mat-input-name").should("have.value", "Nouveau Niveau");
        cy.get("#mat-input-description").should("have.value", "Description du nouveau niveau");

        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).should("have.value", `Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).should("have.value", `Description Longue ${i}`);
        }

      });

      it("Create a new ReadinessLevel Long Description success", () => {
        cy.intercept({
          method: "POST",
          url: "/api/readiness-levels/create-readiness-level",
        }).as("apiCreateReadinessLevel");

        cy.get('.add-container > .mdc-button > .mdc-button__label').click();
        
        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("Nouveau Niveau");
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");

        // Enter short & long level's descriptions
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}.1\nDescription Longue ${i}.2\n\n\nDescription Longue ${i}.3`);
        }

        //Click on the create button
        cy.get('#confirm').click();

        //Verify that the Api call is successful
        cy.wait("@apiCreateReadinessLevel").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
        });

        //Verify that the success message is displayed
        cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should("be.visible");
        cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should("have.text", " Le niveau de maturité a été créé avec succès\n");
        
        //Verify that the new ReadinessLevel is displayed
        cy.get(":nth-child(7) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").should("be.visible");
        cy.get(":nth-child(7) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").should("have.text", "Nouveau Niveau");

        // Open the new ReadinessLevel
        cy.get(":nth-child(7) > .mat-mdc-card > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").click();

        // Verify that description, short and long level's descriptions are displayed
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).should("have.value", `Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).should("have.value", `Description Longue ${i}.1\n\nDescription Longue ${i}.2\n\nDescription Longue ${i}.3`);
        }
      });

      it("Create a new ReadinessLevel without name", () => {
        cy.get('.add-container > .mdc-button > .mdc-button__label').click();

        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");

        //Add a description, long and short level's descriptions
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
        }

        //Check mat-error is displayed
        cy.get("#mat-error-name").should("exist");
        cy.get("#mat-error-name").should("have.text", "Le nom du niveau de maturité est requis");

        //Check that the create button is disabled
        cy.get('#confirm').should("be.disabled");
      });

      it("Create a new ReadinessLevel name is too short", () => {
        cy.get('.add-container > .mdc-button > .mdc-button__label').click();

        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("nouveau niveauuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");
        
         // Enter short & long level's descriptions
         for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
        }

        //Check mat-error is displayed
        cy.get("#mat-error-name").should("exist");
        cy.get("#mat-error-name").should("have.text", "Le nom du niveau de maturité ne doit pas dépasser 20 caractères");
        
        //Check that the create button is disabled
        cy.get('#confirm').should("be.disabled");
      });

      it("Create a new ReadinessLevel name is too long", () => {
        cy.get('.add-container > .mdc-button > .mdc-button__label').click();

        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("ab");
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");
        
         // Enter short & long level's descriptions
         for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
        }

        //Check mat-error is displayed
        cy.get("#mat-error-name").should("exist");
        cy.get("#mat-error-name").should("have.text", "Le nom du niveau de maturité doit contenir au moins 3 caractères");
        
        //Check that the create button is disabled
        cy.get('#confirm').should("be.disabled");
      });

      it("Create a new ReadinessLevel without description", () => {
        cy.get('.add-container > .mdc-button > .mdc-button__label').click();

        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("Nouveau Niveau");
        cy.get("#mat-input-description").click();

        // Enter short & long level's descriptions
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
        }

        //Check that the create button is disabled
        cy.get('#confirm').should("be.disabled");

        //Check mat-error is displayed
        cy.get("#mat-error-description").should("exist");
        cy.get("#mat-error-description").should("have.text","Une description est requise");
      });

      it("Create a new ReadinessLevel without a short description", () => {
        cy.get('.add-container > .mdc-button > .mdc-button__label').click();

        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("Nouveau Niveau");
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");

        // Enter short & long level's descriptions
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          if(i!=1){
            cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          }
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
        }

        //Check that the create button is disabled
        cy.get('#confirm').should("be.disabled");

        //Check mat-error is displayed
        cy.get("#mat-error-1-short").should("have.text", "Une description est requise");
      });

      it("Create a new ReadinessLevel without a long description", () => {
        cy.get('.add-container > .mdc-button > .mdc-button__label').click();

        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("Nouveau Niveau");
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");

        // Enter short & long level's descriptions
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          
          cy.get(`#mat-input-${i}-long`).click();
          if(i!=1){
            cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
          }
        }

        //Check that the create button is disabled
        cy.get('#confirm').should("be.disabled");

        //Check mat-error is displayed
        cy.get("#mat-error-1-long").should("have.text", "Au moins une description détaillée est requise");
      });

      it("Create a new ReadinessLevel name is already took", () => {
        cy.intercept({
          method: "POST",
          url: "/api/readiness-levels/create-readiness-level",
        }).as("apiCreateReadinessLevel");

        //Click on the Add button to open the dialog
        cy.get('.add-container > .mdc-button > .mdc-button__label').click();
        
        // Add a name, description,
        cy.get("#mat-input-name").click({force: true});
        cy.get("#mat-input-name").type("Customer");
        cy.get("#mat-input-description").click();
        cy.get("#mat-input-description").type("Description du nouveau niveau");

        
        // Enter short & long level's descriptions
        for (let i = 1; i <= 9; i++) {
          cy.get(`#mat-input-${i}-short`).click();
          cy.get(`#mat-input-${i}-short`).type(`Description courte ${i}`);
          cy.get(`#mat-input-${i}-long`).click();
          cy.get(`#mat-input-${i}-long`).type(`Description Longue ${i}`);
        }

        //Click on the create button
        cy.get('#confirm').click();

        //Verify that the Api call is conflict
        cy.wait("@apiCreateReadinessLevel").then((interception) => {
          if (interception.response) {
            expect(interception.response.statusCode).to.eq(409);
          } else {
            throw new Error("interception.response is undefined");
          }
        });

        // Check mat-error is displayed
        cy.get("#mat-error-name").should("have.text", "Ce nom déjà pris");

        //Check that the create button is disabled
        cy.get('#confirm').should('be.disabled');
      });
    }
  );

  context("US : XRLO-52 As an Admin, I must be able to modify an existing ReadinessLevel", () => {
    
    let readinessLevelId;
    let readinessLevelTakenName;

    beforeEach(() => {
      readinessLevelId = database.readiness_levels[0]._id;
      readinessLevelTakenName = database.readiness_levels[1].name;
    });
    
    it("Update a ReadinessLevel success", () => {
        cy.intercept({
          method: "PUT",
          url: "/api/readiness-levels/update-readiness-level",
        }).as("apiUpdateReadinessLevel");

        //Click on the first ReadinessLevel to open the edit dialog
        cy.get("#readiness-level-card-"+readinessLevelId).click();

        //Update the name, description, long and short level's descriptions
        cy.get("#mat-input-name").clear();
        cy.get("#mat-input-name").type("Modified Name");
        cy.get("#mat-input-description").clear();
        cy.get("#mat-input-description").type("Modified Description");
        cy.get("#mat-input-1-short").clear();
        cy.get("#mat-input-1-short").type("Modified Short Description");
        cy.get("#mat-input-1-long").clear();
        cy.get("#mat-input-1-long").type("Modified Long Description");

        //Click on the update button
        cy.get('#confirm').click();

        //Verify that the Api call is successful
        cy.wait("@apiUpdateReadinessLevel").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
        });

        //Verify that the success message is displayed
        cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should("have.text"," Le niveau de maturité a été mis à jour avec succès\n");

        //Verify that the updated ReadinessLevel is displayed
        cy.get("#readiness-level-card-"+readinessLevelId+" > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").should("have.text", "Modified Name");
        
        //Click on the updated ReadinessLevel to open the edit dialog
        cy.get("#readiness-level-card-"+readinessLevelId+" > .mat-mdc-card-header").click();
        
        //Check that the updated values are displayed
        cy.get("#mat-input-name").should("have.value", "Modified Name");
        cy.get("#mat-input-description").should("have.value", "Modified Description");
        cy.get("#mat-input-1-short").should("have.value", "Modified Short Description");
        cy.get("#mat-input-1-long").should("have.value", "Modified Long Description");
        
      });

      it("Update a ReadinessLevel success same name", () => {
        cy.intercept({
          method: "PUT",
          url: "/api/readiness-levels/update-readiness-level",
        }).as("apiUpdateReadinessLevel");

        //Click on the first ReadinessLevel to open the edit dialog
        cy.get("#readiness-level-card-"+readinessLevelId).click();

        //Update the name, description, long and short level's descriptions
        cy.get("#mat-input-description").clear();
        cy.get("#mat-input-description").type("Modified Description");
        cy.get("#mat-input-1-short").clear();
        cy.get("#mat-input-1-short").type("Modified Short Description");
        cy.get("#mat-input-1-long").clear();
        cy.get("#mat-input-1-long").type("Modified Long Description");

        //Click on the update button
        cy.get('#confirm').click();

        //Verify that the Api call is successful
        cy.wait("@apiUpdateReadinessLevel").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
        });

        //Verify that the success message is displayed
        cy.get(".mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label").should("have.text"," Le niveau de maturité a été mis à jour avec succès\n");

        //Verify that the updated ReadinessLevel is displayed
        cy.get("#readiness-level-card-"+readinessLevelId+" > .mat-mdc-card-header > .mat-mdc-card-header-text > .mat-mdc-card-title").should("have.text", "Customer");
        
        //Click on the updated ReadinessLevel to open the edit dialog
        cy.get("#readiness-level-card-"+readinessLevelId+" > .mat-mdc-card-header").click();
        
        //Check that the updated values are displayed
        cy.get("#mat-input-name").should("have.value", "Customer");
        cy.get("#mat-input-description").should("have.value", "Modified Description");
        cy.get("#mat-input-1-short").should("have.value", "Modified Short Description");
        cy.get("#mat-input-1-long").should("have.value", "Modified Long Description");
      });

      it("Update a ReadinessLevel Name already took", () => {
        cy.intercept({
          method: "PUT",
          url: "/api/readiness-levels/update-readiness-level",
        }).as("apiUpdateReadinessLevel");

        //Click on the first ReadinessLevel to open the edit dialog
        cy.get("#readiness-level-card-"+readinessLevelId).click();

        //Update the name to an existing RL name
        cy.get("#mat-input-name").clear();
        cy.get("#mat-input-name").type(readinessLevelTakenName);

        //Click on the update button
        cy.get('#confirm').click();

        //Verify that the Api call is conflict
        cy.wait("@apiUpdateReadinessLevel").then((interception) => {
          if (interception.response) {
            expect(interception.response.statusCode).to.eq(409);
          } else {
            throw new Error("interception.response is undefined");
          }
        });

        // Check mat-error is displayed
        cy.get("#mat-error-name").should("have.text", "Ce nom déjà pris");

        //Check that the create button is disabled
        cy.get('#confirm').should('be.disabled');
      });
    }
  );
});
