# MongoDB

We manage the database in the `./db` folder

Inside this folder we find : 

- DB_Collections folder
- DB_Insert folder
- [compile_db_script.sh](/misc/scripts/#compile_db_scriptsh)
- [Dockerfile](/misc/docker/#mongodb-dockerfile)
- init_database.js
- mongod.conf

## DB_Collections

```js
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
```

## DB_Insert

```js
// Insert : Users
const users = db.users.insertMany([
    {
        "login":"admin",
        "firstName":"admin",
        "lastName":"admin"
    },
    {
        "login":"cardotcl",
        "firstName":"Clément",
        "lastName":"Cardot"
    },
    ...
    {
        "login":"jeanm",
        "firstName":"Marie",
        "lastName":"Jean"
    }
]);
```

## init_database.js

```js
// Define the Database
db = new Mongo().getDB("xrlonline");
```

## mongod.conf

```conf
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: /var/lib/mongodb

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0


# how the process runs
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
```