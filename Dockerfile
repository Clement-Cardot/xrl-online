# BACK BUILD STAGE
FROM maven:3.8.1-openjdk-17 AS back-build
COPY ./back /back
WORKDIR /back
RUN mvn clean package -P prod -DskipTests

# FRONT BUILD STAGE 1 DEPENDENCIES
FROM node:18.18.0-alpine AS front-dependencies
COPY ./front /front
WORKDIR /front
# Do not remove the following lines, they are used by the gitlab pipeline to set proxy for npm
#PLACEHOLDER1
#PLACEHOLDER2
RUN npm install
RUN npm install -g @angular/cli

# FRONT BUILD STAGE 2 BUILD
FROM front-dependencies AS front-build
COPY --from=front-dependencies /front /front
RUN ng build --configuration=production

# DOCS BUILD STAGE
FROM python:3.9.18-alpine AS docs-build
COPY ./docs /workspace/docs
COPY mkdocs.yml /workspace/mkdocs.yml
WORKDIR /workspace
# Do not remove the following line, it is used by the gitlab pipeline to set proxy for pip
#PLACEHOLDER3
RUN pip install mkdocs
RUN mkdocs build

# DEPLOY STAGE
FROM tomcat:10.1.13-jre17

# Configure Tomcat
RUN cp -r $CATALINA_HOME/webapps.dist/host-manager $CATALINA_HOME/webapps/host-manager
RUN cp -r $CATALINA_HOME/webapps.dist/manager $CATALINA_HOME/webapps/manager

COPY .tomcat/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY .tomcat/context.xml /usr/local/tomcat/conf/context.xml
COPY .tomcat/context.xml /usr/local/tomcat/webapps/host-manager/META-INF/context.xml
COPY .tomcat/context.xml /usr/local/tomcat/webapps/manager/META-INF/context.xml

# Deploy Back End
COPY --from=back-build /back/target/xrlonline-back-0.3.war /usr/local/tomcat/webapps/api.war

# Deploy Front End
COPY --from=front-build /front/dist/xrl /usr/local/tomcat/webapps/ROOT

# Deploy Docs
COPY --from=docs-build /workspace/site /usr/local/tomcat/webapps/docs