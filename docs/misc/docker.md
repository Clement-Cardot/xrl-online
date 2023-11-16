# Docker

## Tomcat DockerFile

```DOCKERFILE
FROM tomcat:10.1.13-jre17

# Configure Tomcat
RUN cp -r $CATALINA_HOME/webapps.dist/host-manager $CATALINA_HOME/webapps/host-manager
RUN cp -r $CATALINA_HOME/webapps.dist/manager $CATALINA_HOME/webapps/manager

COPY .tomcat/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY .tomcat/context.xml /usr/local/tomcat/conf/context.xml
COPY .tomcat/context.xml /usr/local/tomcat/webapps/host-manager/META-INF/context.xml
COPY .tomcat/context.xml /usr/local/tomcat/webapps/manager/META-INF/context.xml

# Deploy Back End
COPY back/target/xrlonline-0.2.war /usr/local/tomcat/webapps/api.war

# Deploy Front End
COPY front/dist/xrl /usr/local/tomcat/webapps/ROOT
```

## MongoDB DockerFile

```DOCKERFILE
FROM mongo:7.0-rc-jammy

# Add initialization script
COPY ./mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js

# Add config file
COPY ./mongod.conf /etc/mongod.conf
```

## Docker Compose

```yaml
version: '3'
services:
  mongodb:
    image: clementcardot/xrl-online-db
    build:
      context: db
      dockerfile: Dockerfile
    ports:
      - "27017:27017"

  tomcat:
    image: clementcardot/xrl-online-tomcat
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - mongodb
    volumes:
      - ./logs:/usr/local/tomcat/logs
```