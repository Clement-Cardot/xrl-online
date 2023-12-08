FROM mongo:7.0-rc-jammy

COPY ./mongod.conf /etc/mongod.conf

COPY ./DB_Collections /build/DB_Collections/
COPY ./DB_Insert /build/DB_Insert/
COPY ./init_database.js /build/
COPY ./compile_db_script.sh /build/

# Install dos2unix to convert line endings to unix format
RUN apt-get update && apt-get install -y dos2unix && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*
RUN dos2unix /build/compile_db_script.sh
RUN apt-get --purge remove -y dos2unix

RUN chmod +x /build/compile_db_script.sh

WORKDIR /build
RUN /build/compile_db_script.sh
RUN mv /build/mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js