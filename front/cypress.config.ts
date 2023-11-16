import { defineConfig } from "cypress";
import { configurePlugin } from 'cypress-mongodb';
import { MongoClient, Timestamp } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

export default defineConfig({
  env: {
    mongodb: {
        uri: uri,
        database: 'xrlonline'
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      configurePlugin(on);
      on('task', {
        Seed_DB() {
          return Seed_MongoDB();
        }
      })
    },
    experimentalStudio: true,
    baseUrl: "http://localhost:4200",
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
  "reporter": "junit",
  "reporterOptions": {
     "mochaFile": "cypress/results/results-[hash].xml",
     "toConsole": true
  }
});

type Database = {
  users: any[];
  teams: any[];
  business_lines: any[];
  readiness_levels: any[];
  projects: any[];
}

const Seed_MongoDB = async () => {
  // Define the Database
  const db = client.db("xrlonline");

  await db.collection('users').deleteMany({});
  await db.collection('teams').deleteMany({});
  await db.collection('businesslines').deleteMany({});
  await db.collection('readinesslevels').deleteMany({});
  await db.collection('projects').deleteMany({});

  // Insert : Users
  const users = await db.collection('users').insertMany([
      {
          "login":"admin",
          "firstName":"admin",
          "lastName":"admin"
      },
      {
          "login":"cardotcl",
          "firstName":"Clément",
          "lastName":"Cardot"
      },
      {
          "login":"duboisj",
          "firstName":"Jean",
          "lastName":"Dubois"
      },
      {
          "login":"dupontp",
          "firstName":"Pierre",
          "lastName":"Dupont"
      },
      {
          "login":"durandm",
          "firstName":"Marie",
          "lastName":"Durand"
      },
      {
          "login":"martinj",
          "firstName":"Jean",
          "lastName":"Martin"
      },
      {
          "login":"richardt",
          "firstName":"Thomas",
          "lastName":"Richard"
      },
      {
          "login":"robertj",
          "firstName":"Jean",
          "lastName":"Robert"
      },
      {
          "login":"rouxj",
          "firstName":"Jean",
          "lastName":"Roux"
      },
      {
          "login":"vincentm",
          "firstName":"Marie",
          "lastName":"Vincent"
      },
      {
          "login":"berthierj",
          "firstName":"Jean",
          "lastName":"Berthier"
      },
      {
          "login":"davidm",
          "firstName":"Marie",
          "lastName":"David"
      },
      {
          "login":"durandj",
          "firstName":"Jean",
          "lastName":"Durand"
      },
      {
          "login":"fontainem",
          "firstName":"Marie",
          "lastName":"Fontaine"
      },
      {
          "login":"garciaj",
          "firstName":"Jean",
          "lastName":"Garcia"
      },
      {
          "login":"gonzalezm",
          "firstName":"Marie",
          "lastName":"Gonzalez"
      },
      {
          "login":"hervej",
          "firstName":"Jean",
          "lastName":"Hervé"
      },
      {
          "login":"jeanm",
          "firstName":"Marie",
          "lastName":"Jean"
      }
  ]);

  // Insert : Teams
  const teams = await db.collection('teams').insertMany([
      {
          "name":"Team1",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[0]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[1]
              },
          ]
      },
      {
          "name":"Team2",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[2]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[3]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[4]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[5]
              }
          ]
      },
      {
          "name":"Team3",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[6]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[7]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[8]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[9]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[10]
              }
          ]
      },
      {
          "name":"Team4",
          "members":[
              {
                  $ref: "users",
                  $id: users.insertedIds[0]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[1]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[2]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[3]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[4]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[5]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[6]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[7]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[8]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[9]
              },
              {
                  $ref: "users",
                  $id: users.insertedIds[10]
              }
          ]
      }
  ]);

  // Insert : Business Lines
  const business_lines = await db.collection('businesslines').insertMany([
      {
          name: "Business Line 1"
      },
      {
          name: "Business Line 2"
      },
      {
          name: "Business Line 3"
      },
      {
          name: "Business Line 4"
      }
  ]);

  // Insert : Readiness Levels
  const readiness_levels = await db.collection('readinesslevels').insertMany([
      {
          name: "Readiness Level 1",
          description: "Description for Readiness Level 1",
          levels:[
              {
                  level:1,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:2,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:3,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:4,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:5,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:6,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:7,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:8,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:9,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },

          ]
      },
      {
          name: "Readiness Level 2",
          description: "Description for Readiness Level 2",
          levels:[
              {
                  level:1,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:2,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:3,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:4,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:5,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:6,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:7,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:8,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:9,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },

          ]
      },
      {
          name: "Readiness Level 3",
          description: "Description for Readiness Level 3",
          levels:[
              {
                  level:1,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:2,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:3,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:4,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:5,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:6,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:7,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:8,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:9,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },

          ]
      },
      {
          name: "Readiness Level 4",
          description: "Description for Readiness Level 4",
          levels:[
              {
                  level:1,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:2,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:3,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:4,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:5,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:6,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:7,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:8,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:9,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },

          ]
      },
      {
          name: "Readiness Level 5",
          description: "Description for Readiness Level 5",
          levels:[
              {
                  level:1,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:2,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:3,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:4,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:5,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:6,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:7,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:8,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:9,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },

          ]
      },
      {
          name: "Readiness Level 6",
          description: "Description for Readiness Level 6",
          levels:[
              {
                  level:1,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:2,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:3,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:4,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:5,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:6,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:7,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:8,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },
              {
                  level:9,
                  shortDescription:"Short Description",
                  longDescription:"Long Description"
              },

          ]
      }
  ]);

  // Insert : Projects
  const project = await db.collection('projects').insertMany([
      {
          name:"Project 1",
          description:"Description of project 1",
          businessLine: {
              $ref: "businesslines",
              $id: business_lines.insertedIds[0]
          },
          team: {
              $ref: "teams",
              $id: teams.insertedIds[0]
          },
          assessments:[
              {
                  date: new Date("2021-08-27T19:00:38.000+00:00"),
                  tag:"INITIAL",
                  comment:"First assessment",
                  readinessLevels:[
                      {
                          readinessLevel: {
                              $ref: "readinesslevels",
                              $id: readiness_levels.insertedIds[0]
                          },
                          rank:5
                      },
                      {
                          readinessLevel: {
                              $ref: "readinesslevels",
                              $id: readiness_levels.insertedIds[1]
                          },
                          rank:2
                      },
                      {
                          readinessLevel: {
                              $ref: "readinesslevels",
                              $id: readiness_levels.insertedIds[2]
                          },
                          rank:8
                      },
                      {
                          readinessLevel: {
                              $ref: "readinesslevels",
                              $id: readiness_levels.insertedIds[3]
                          },
                          rank:9
                      },
                      {
                          readinessLevel: {
                              $ref: "readinesslevels",
                              $id: readiness_levels.insertedIds[4]
                          },
                          rank:3
                      },
                      {
                          readinessLevel: {
                              $ref: "readinesslevels",
                              $id: readiness_levels.insertedIds[5]
                          },
                          rank:4
                      }
                  ]
              }
          ]
      }
  ]);

  const getDatabase = async (): Promise<Database> => {
      return {
      users: await db.collection('users').find({}).toArray(),
      teams: await db.collection('teams').find({}).toArray(),
      business_lines: await db.collection('businesslines').find({}).toArray(),
      readiness_levels: await db.collection('readinesslevels').find({}).toArray(),
      projects: await db.collection('projects').find({}).toArray()
      }
  }

  return await getDatabase();
};