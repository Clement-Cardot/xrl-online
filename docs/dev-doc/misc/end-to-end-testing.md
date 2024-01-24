# Cypress

Cypress is a JavaScript end-to-end testing framework. It is used to test the entire application from the user's perspective. It is a very powerful tool that allows us to test our application in a very realistic way. It is also very easy to use and to set up.

## Usage

To run the tests, you have two options :
- Run the tests in the Cypress GUI : `npm run cypress:open`
- Run the tests in the terminal : `npm run cypress:run`

The cypress GUI is very useful to debug the tests. It allows you to see the tests running in real time and to see what the application looks like at each step of the test. It also allows you to run a single test or a single suite of tests.

The cypress CLI is very useful to run the tests in a CI/CD pipeline. It allows you to run the tests in a headless browser and to get the results in a JSON file.

## Structure

The tests are located in the `front/cypress/e2e` folder. The tests are divided into suites. Each suite is a file containing the tests for a specific feature/page. Each test is a function containing the actions and expectation for a specific scenario.

Some actions are repeated in multiple tests. To avoid code duplication, these actions are defined in the `front/cypress/support/commands.js` file. This file is automatically loaded by Cypress and the actions defined in it are available in all the tests.

## Tests

Here is an example of a test suite and a test.
A test suite is defined by the `describe` function. It contains one or more tests. A test is defined by the `it` function. It contains the actions and expectations for a specific scenario.

We also use the `beforeEach` function to perform some actions before each test. In this example, we use it a first time to seed our database then a second time to log in as an admin user and to go to the admin teams page.

We also use the `context` function to group tests that are related to the same user story.

In this example, we use in the test the 'addNewUser' action defined in the `front/cypress/support/commands.js` file. This action is used to create a new user and check if everything went well.

```js title="admin-team-page.cy.ts"
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

      ...
      ...
      ...
    });
});

```

After in the same file we test the other cases of the 'Create a new User' user story. In this example, we test the case where the user login is already used. For that we can't use the 'addNewUser' function because it purpose is to check if everything went well. But here we want to check if the error message is displayed. So we have to do the actions manually and then check if the error message is displayed.

#### Database seeding

Thanks to the `cy.task("Seed_DB")` function, we can seed our database before each test. This function is defined in the `/front/cypress.config.ts` file. It allows us to seed our database with testing data. This is very useful to test our application with realistic data.
Then we can access the data in the tests with the `database` variable.

```js title="admin-team-page.cy.ts"
it("Create a new User login already used", () => {
    // Intercept api call
    cy.intercept({
        method: "POST",
        url: "/api/users/create-user",
    }).as("apiCreateUser");

    // Create new user
    cy.get("#addUserBtn").click();
    cy.get("#firstName-input").type(database.users[1].firstName);
    cy.get("#lastName-input").type(database.users[1].lastName);
    cy.get("#login-input").type(database.users[1].login);
    cy.get('#confirm').click();

    // Check api response
    cy.wait("@apiCreateUser").then((interception) => {
        if (interception.response) {
        expect(interception.response.statusCode).to.eq(409);
        } else {
        throw new Error("interception.response is undefined");
        }
    });

    // Check error message
    cy.get("#login-mat-error").should("have.text", "Cet identifiant existe déjà");
    cy.get("#login-mat-error").should("be.visible");
});

```

## References

For any questions regarding the Cypress framework, please refer to the [Cypress documentation](https://docs.cypress.io/guides/overview/why-cypress.html).</br>
The documentation is very well written and contains a lot of examples.