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

