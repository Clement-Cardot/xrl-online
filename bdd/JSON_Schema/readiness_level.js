db.createCollection("readiness_level", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "name", "description", "levels"],
            properties: {
                _id: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
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
                        required: ["level_id", "short_description", "long_description"],
                        properties: {
                            level_id: {
                                bsonType: "number",
                                description: "must be a number and is required"
                            },
                            short_description: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            long_description: {
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