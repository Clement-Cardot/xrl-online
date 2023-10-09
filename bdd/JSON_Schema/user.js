db.createCollection("user", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "login", "firstname", "lastname"],
            properties: {
                _id: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                login: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                firstname: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                lastname: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    }
});