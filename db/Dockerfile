FROM mongo:7.0-rc-jammy

COPY ./mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js

COPY ./mongod.conf /etc/mongod.conf