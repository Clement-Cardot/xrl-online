package fr.eseo.pfe.xrlonline.logger;

import org.apache.logging.slf4j.SLF4JLogger;
import org.apache.logging.log4j.Logger;

public class UserLoggerFactory {

  private UserLoggerFactory() {
    throw new IllegalStateException("This class should not be instantiated");
  }

  public static UserLogger getLogger(Class<?> clazz, Logger log) {
    return new UserLogger(clazz, ((SLF4JLogger) log).getLogger());
  }
}
