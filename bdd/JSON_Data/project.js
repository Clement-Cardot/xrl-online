db.project.insertMany([
    {
        _id:2,
        name:"Project 1",
        description:"Description of project 1",
        business_line_id:1,
        team_id:1,
        assessments:[
            {
                timestamp: new Timestamp(1696154937, 1),
                tag:"INITIAL",
                comment:"First assessment",
                readiness_levels:[
                    {
                        readiness_level_id:1,
                        rank:5
                    },
                    {
                        readiness_level_id:2,
                        rank:2
                    },
                    {
                        readiness_level_id:3,
                        rank:8
                    },
                    {
                        readiness_level_id:4,
                        rank:9
                    },
                    {
                        readiness_level_id:5,
                        rank:3
                    },
                    {
                        readiness_level_id:6,
                        rank:4
                    }
                ]
            }
        ]
    }
]);
