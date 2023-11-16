// Collection: project
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
                        required: ["date", "tag", "comment", "readinessLevels"],
                        properties: {
                            date: {
                                bsonType: "date",
                                description: "must be a date and is required"
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

