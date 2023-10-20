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