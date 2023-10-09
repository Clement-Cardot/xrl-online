db.createCollection("business_line", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "name"],
            properties: {
                _id: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    }
});