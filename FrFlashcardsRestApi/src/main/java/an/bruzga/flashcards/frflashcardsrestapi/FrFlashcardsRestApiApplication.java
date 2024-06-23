package an.bruzga.flashcards.frflashcardsrestapi;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FrFlashcardsRestApiApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .directory("./FrFlashcardsRestApi/.env")  // specify the path to your .env file
                .ignoreIfMissing()
                .load();
        for (DotenvEntry entry : dotenv.entries()) {
            System.setProperty(entry.getKey(), entry.getValue());
        }
        SpringApplication.run(FrFlashcardsRestApiApplication.class, args);
    }
}