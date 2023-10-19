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

