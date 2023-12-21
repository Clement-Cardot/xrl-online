// Insert : Projects
db.projects.insertMany([
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
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:3,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            },

            {
                date: new Date("2022-08-27T19:00:38.000+00:00"),
                comment:"assessment 2",
                tag:"INTERMEDIATE",
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:5,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:8,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:9,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:3,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:4,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            },

            {
                date: new Date("2023-08-27T19:00:38.000+00:00"),
                tag:"DRAFT",
                comment:"First assessment",
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:8,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:9,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:8,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:9,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:7,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:6,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            }
        ]
    },
    {
        name:"Project 2",
        description:"Description of project 2",
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
                readinessLevelRanks:[
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[0]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[1]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[2]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[3]
                        },
                        rank:3,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[4]
                        },
                        rank:2,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    },
                    {
                        readinessLevel: {
                            $ref: "readinesslevels",
                            $id: readiness_levels.insertedIds[5]
                        },
                        rank:1,
                        comment:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et pharetra sem. Sed maximus euismod."
                    }
                ]
            }
        ]
    }
]);

