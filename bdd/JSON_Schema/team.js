db.createCollection("team", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "name", "members"],
            properties: {
                _id: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                members: {
                    bsonType: "array",
                    items: {
                        bsonType: "number",
                        description: "must be a number and is required"
                    }
                }
            }
        }
    }
});