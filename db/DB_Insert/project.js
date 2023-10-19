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
                timestamp: new Timestamp(1696154937, 1),
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

