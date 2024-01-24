# General Informations

## Dependencies

We mainly use the following dependencies:

- [Angular Material](https://material.angular.io/) for the UI
- [Chart.js](https://www.chartjs.org/) for the radar charts
- [ApexCharts](https://apexcharts.com/) for the gauge charts
- [NGX-Translate](https://github.com/ngx-translate/core) for the translations
- [Cypress](https://www.cypress.io/) for the end-to-end tests

To install all of the dependencies, you need to run the following command:

```bash
npm install -g @angular/cli
npm install
```

## Architecture

The frontend is divided into 4 main parts:

- The **Pages** that are the different pages of the application
- The **Components** that are the different components of pages
- The **Models** that are the different data structures used by the application
- The **Services** that are the different API calls

## Starting the application

To start the application in a dev environment, you need to run the following commands:

```bash
ng serve
```

For production, you need to run the following commands:

```bash
ng build --configuration=production
```

Then you need to serve the `dist/frontend` folder with a web server.