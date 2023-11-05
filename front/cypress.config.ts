import { defineConfig } from "cypress";
import { configurePlugin } from 'cypress-mongodb';

export default defineConfig({
  env: {
    mongodb: {
        uri: 'mongodb://localhost:27017',
        database: 'xrlonline'
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      configurePlugin(on);
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