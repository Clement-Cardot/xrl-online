package fr.eseo.pfe.xrlonline.logger;

import org.apache.logging.slf4j.SLF4JLogger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;

public class UserLogger extends SLF4JLogger {

  public UserLogger(Class<?> clazz, Logger logger) {
    super(clazz.getName(), logger);
  }

  public void logInfo(String message, Object... vars) {
    String username = getUsername();
    message = String.format(message, vars);
    getLogger().info("AS [{}] {}", username, message);
  }

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
}
