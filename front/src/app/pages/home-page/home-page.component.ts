import { Component } from '@angular/core';
import { AssessmentAdapter } from 'src/app/core/data/models/assessment.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(private assessmentAdapter: AssessmentAdapter) { }

  MockedAssement = this.assessmentAdapter.adapt(
    {
      timestamp: "2021-06-01T00:00:00.000Z",
      tag: "Version 1.0",
      comment: "mocked",
      readinessLevels: [
        {
          readinessLevel: {
            name: "RL-1",
            description: "RL-1 description",
            levels: [
              {
                name: "RL-1.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 5
        },
        {
          readinessLevel: {
            name: "RL-2",
            description: "RL-2 description",
            levels: [
              {
                name: "RL-2.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 5
        },
        {
          readinessLevel: {
            name: "RL-3",
            description: "RL-3 description",
            levels: [
              {
                name: "RL-3.1",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.2",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.3",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.4",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.5",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.6",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.7",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.8",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.9",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },

            ]
          },
          rank: 5
        },
        {
          readinessLevel: {
            name: "RL-4",
            description: "RL-4 description",
            levels: [
              {
                name: "RL-4.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 4
        },
        {
          readinessLevel: {
            name: "RL-5",
            description: "RL-5 description",
            levels: [
              {
                name: "RL-5.1",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.2",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.3",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.4",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.5",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.6",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.7",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.8",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.9",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },

            ]
          },
          rank: 5
        },
        {
          readinessLevel: {
            name: "RL-6",
            description: "RL-6 description",
            levels: [
              {
                name: "RL-6.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 5
        },
      ]
    }
  );

  MockedAssement2 = this.assessmentAdapter.adapt(
    {
      timestamp: "2021-06-01T00:00:00.000Z",
      tag: "version 2.0",
      comment: "mocked",
      readinessLevels: [
        {
          readinessLevel: {
            name: "RL-1",
            description: "RL-1 description",
            levels: [
              {
                name: "RL-1.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-1.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 9
        },
        {
          readinessLevel: {
            name: "RL-2",
            description: "RL-2 description",
            levels: [
              {
                name: "RL-2.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-2.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 2
        },
        {
          readinessLevel: {
            name: "RL-3",
            description: "RL-3 description",
            levels: [
              {
                name: "RL-3.1",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.2",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.3",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.4",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.5",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.6",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.7",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.8",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },
              {
                name: "RL-3.9",
                shortDescription: "RL-3.1 short description",
                longDescription: "RL-3.1 long description"
              },

            ]
          },
          rank: 4
        },
        {
          readinessLevel: {
            name: "RL-4",
            description: "RL-4 description",
            levels: [
              {
                name: "RL-4.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-4.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 3
        },
        {
          readinessLevel: {
            name: "RL-5",
            description: "RL-5 description",
            levels: [
              {
                name: "RL-5.1",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.2",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.3",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.4",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.5",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.6",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.7",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.8",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },
              {
                name: "RL-5.9",
                shortDescription: "RL-5.1 short description",
                longDescription: "RL-5.1 long description"
              },

            ]
          },
          rank: 8
        },
        {
          readinessLevel: {
            name: "RL-6",
            description: "RL-6 description",
            levels: [
              {
                name: "RL-6.1",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.2",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.3",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.4",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.5",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.6",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.7",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.8",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },
              {
                name: "RL-6.9",
                shortDescription: "RL-1.1 short description",
                longDescription: "RL-1.1 long description"
              },

            ]
          },
          rank: 7
        },
      ]
    }
  );

}
