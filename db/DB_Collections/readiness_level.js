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
                                bsonType: "array",
                                items :{
                                    bsonType: "string",
                                    description: "must be a string and is required"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

