package an.bruzga.flashcards.frflashcardsrestapi;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FrFlashcardsRestApiApplication {

    private static final Logger logger = LoggerFactory.getLogger(FrFlashcardsRestApiApplication.class);

    public static void main(String[] args) {
        logger.info("Starting Backend...");

        Dotenv dotenv = Dotenv.configure()
                .directory("./FrFlashcardsRestApi/.env")  // specify the path to your .env file
                .ignoreIfMissing()
                .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(FrFlashcardsRestApiApplication.class, args);
        logger.info("Backend started successfully.");
    }
}
