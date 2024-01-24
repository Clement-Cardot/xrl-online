# Logger

We want our logger to be able to log the user login before each log. To do that we extend the SLF4J logger and define our own logging method. We retrieve the login from the SecurityContextHolder and add it to the log message.

```java title="UserLogger.java"
public void logError(String message, Object... vars) {
    String username = getUsername();
    message = String.format(message, vars);
    getLogger().error("AS [{}] {}", username, message);
}

public String getUsername() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null) {
        return "anonymous";
    }
    return authentication.getName();
}
```

With this configuration, we optain the following log:

```log
2024-01-19 12:24:14.468 [http-nio-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet - Completed initialization in 1 ms
2024-01-19 12:24:14.563 [http-nio-8080-exec-1] INFO  f.e.p.x.controller.ProjectController - AS [anonymousUser] REQUEST: Get project with id : 65aa56da88032facc60cca7c
2024-01-19 12:24:24.025 [http-nio-8080-exec-2] INFO  f.e.p.x.controller.UserController - AS [anonymousUser] REQUEST: Try to log in with : cardotcl
2024-01-19 12:24:24.060 [http-nio-8080-exec-2] INFO  f.e.p.x.controller.UserController - AS [cardotcl] Log in success with : cardotcl
2024-01-19 12:38:23.233 [http-nio-8080-exec-3] INFO  f.e.p.x.controller.ProjectController - AS [cardotcl] REQUEST: Get all projects
2024-01-19 12:38:26.070 [http-nio-8080-exec-4] INFO  f.e.p.x.controller.ProjectController - AS [cardotcl] REQUEST: Get project with id : 65aa56da88032facc60cca7d
```

Thanks to LogBack, we save the logs with 5 rotation files of 10MB each. Those files are saved in a docker volume so you can access to them directly in the ``/logs`` folder of the project.</br>
Here is the conplete configuration :
```xml title="logback-spring.xml"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>./logs/xrl-online.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
            <fileNamePattern>./logs/xrl-online.%i.log</fileNamePattern>
            <minIndex>1</minIndex>
            <maxIndex>5</maxIndex>
        </rollingPolicy>
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <maxFileSize>10MB</maxFileSize>
        </triggeringPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="FILE" />
    </root>
</configuration>
```