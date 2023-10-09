// Define the Database
db = new Mongo().getDB("xrlonline");


// Create all Collections

// Collection: user
db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["login", "firstName", "lastName"],
            properties: {
                login: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                firstName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                lastName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    }
});

// Collection: team
db.createCollection("teams", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "members"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                members: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["$id", "$ref"],
                        properties: {
                            $id: {
                                bsonType: "objectId",
                                description: "must be a id and is required"
                            },
                            $ref: {
                                bsonType: "string",
                                description: "must be a string and is required",
                            }
                        }
                    }
                }
            }
        }
    }
});

// Collection: business_line
db.createCollection("businesslines", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    }
});

// Collection: readiness_level
db.createCollection("readinesslevels", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "levels"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                description: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                levels: {
                    bsonType: "array",
                    minItems: 9,
                    maxItems: 9,
                    uniqueItems: true,
                    items: {
                        bsonType: "object",
                        required: ["level", "shortDescription", "longDescription"],
                        properties: {
                            level: {
                                bsonType: "number",
                                description: "must be a number and is required",
                                minimum: 1,
                                maximum: 9
                            },
                            shortDescription: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            longDescription: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            }
                        }
                    }
                }
            }
        }
    }
});

// Collection: project
/* The above code is creating a collection named "projects" in a MongoDB database. It also specifies a
validator for the collection, which defines the schema for the documents that can be inserted into
the collection. */
db.createCollection("projects", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                description: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                businessLine: {
                    bsonType: "object",
                    required: ["$id", "$ref"],
                    properties: {
                        $id: {
                            bsonType: "objectId",
                            description: "must be a id and is required"
                        },
                        $ref: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        }    
                    }
                },
                team: {
                    bsonType: "object",
                    required: ["$id", "$ref"],
                    properties: {
                        $id: {
                            bsonType: "objectId",
                            description: "must be a id and is required"
                        },
                        $ref: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        }
                    }
                },
                assessments: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["timestamp", "tag", "comment", "readinessLevels"],
                        properties: {
                            timestamp: {
                                bsonType: "timestamp",
                                description: "must be a timestamp and is required"
                            },
                            tag: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            comment: {
                                bsonType: "string",
                                description: "must be a string"
                            },
                            readinessLevels: {
                                bsonType: "array",
                                items: {
                                    bsonType: "object",
                                    required: ["readinessLevel", "rank"],
                                    properties: {
                                        readinessLevel: {
                                            bsonType: "object",
                                            required: ["$id", "$ref"],
                                            properties: {
                                                $id: {
                                                    bsonType: "objectId",
                                                    description: "must be a id and is required"
                                                },
                                                $ref: {
                                                    bsonType: "string",
                                                    description: "must be a string and is required",
                                                }
                                            }                                            
                                        },
                                        rank: {
                                            bsonType: "number",
                                            description: "must be a number and is required"
                                        },
                                        comment: {
                                            bsonType: "string",
                                            description: "must be a string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});


// Insert Testing Documents

// Insert : Users
const users = db.users.insertMany([
    {
        "login":"admin",
        "firstName":"",
        "lastName":""
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

// Insert : Business Lines
const business_lines = db.businesslines.insertMany([
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
const readiness_levels = db.readinesslevels.insertMany([
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
