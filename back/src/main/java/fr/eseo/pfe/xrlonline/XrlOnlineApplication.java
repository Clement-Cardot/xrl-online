package fr.eseo.pfe.xrlonline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories("fr.eseo.pfe.xrlonline.repository")
public class XrlOnlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(XrlOnlineApplication.class, args);
	}

}
