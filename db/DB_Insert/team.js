// Insert : Teams
const teams = db.teams.insertMany([
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

