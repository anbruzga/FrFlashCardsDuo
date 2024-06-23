package an.bruzga.flashcards.frflashcardsrestapi.flashcard;

import an.bruzga.flashcards.frflashcardsrestapi.lexique.LexiqueDatabase;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CsvDataLoader implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(CsvDataLoader.class);

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private LexiqueDatabase lexiqueDatabase;

    @Override
    public void run(ApplicationArguments args) {
        try {
            loadData();
        } catch (Exception e) {
            logger.error("Failed to load data", e);
        }
    }

    public void loadData() {
        logger.info("Loading data from CSV...");
        try {
            ClassPathResource resource = new ClassPathResource("flashcards.csv");
            try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
                List<String[]> records = reader.readAll();
                logger.info("CSV file read successfully, number of records: {}", records.size());

                List<Flashcard> flashcards = records.stream().skip(1).parallel().map(record -> {
                    Flashcard flashcard = new Flashcard();
                    flashcard.setEnglish(record[1]);
                    flashcard.setFrench(record[2]);
                    flashcard.setTheme(record[4]);
                    String base64Pronunciation = record[3];

                    byte[] pronunciationData = decodeBase64(base64Pronunciation);
                    flashcard.setFrenchPronunciation(pronunciationData);
                    String gender = lexiqueDatabase.getGender(record[2]);
                    flashcard.setGender(gender);
                    return flashcard;
                }).collect(Collectors.toList());

                flashcardRepository.saveAll(flashcards);
                logger.info("Flashcards saved successfully, number of flashcards: {}", flashcards.size());

                // Debugging output
                flashcardRepository.findAll().forEach(flashcard -> logger.debug("Saved flashcard: {}", flashcard));
            }
        } catch (IOException | CsvException e) {
            logger.error("Failed to load data from CSV", e);
        }
    }

    private byte[] decodeBase64(String base64Data) {
        if (base64Data == null || base64Data.isEmpty()) {
            return null;
        }
        try {
            return Base64.getDecoder().decode(base64Data);
        } catch (IllegalArgumentException e) {
            logger.error("Failed to decode Base64 data: {}", base64Data, e);
            return null;
        }
    }
}
