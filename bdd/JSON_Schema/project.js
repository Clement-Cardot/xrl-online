db.createCollection("project", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "name", "description", "business_line_id", "team_id", "assessments"],
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
                business_line_id: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                team_id: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                assessments: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["timestamp", "tag", "comment", "readiness_levels"],
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
                            readiness_levels: {
                                bsonType: "array",
                                items: {
                                    bsonType: "object",
                                    required: ["readiness_level_id", "rank"],
                                    properties: {
                                        readiness_level_id: {
                                            bsonType: "number",
                                            description: "must be a number and is required"
                                        },
                                        rank: {
                                            bsonType: "number",
                                            description: "must be a number and is required"
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