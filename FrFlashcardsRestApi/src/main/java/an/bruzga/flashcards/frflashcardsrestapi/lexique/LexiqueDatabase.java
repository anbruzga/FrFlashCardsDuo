package an.bruzga.flashcards.frflashcardsrestapi.lexique;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Component
public class LexiqueDatabase {

    private final Map<String, String> wordGenderMap = new ConcurrentHashMap<>(10000);


    @Autowired
    public LexiqueDatabase(WordGenderMapSerializer serialiser) {
        if (!serialiser.loadWithChecksum()) {
            try {
                initializeDatabase();
                serialiser.saveWithChecksum();
            } catch (IOException | CsvException e) {
                throw new RuntimeException("Failed to initialize LexiqueDatabase", e);
            }
        }
    }

    private void initializeDatabase() throws IOException, CsvException {
        ClassPathResource resource = new ClassPathResource("Lexique383.tsv");

        if (!resource.exists()) {
            throw new IOException("File not found: " + resource.getPath());
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream()));
             CSVReader reader = new CSVReaderBuilder(br)
                     .withCSVParser(new CSVParserBuilder().withSeparator('\t').build())
                     .build()) {

            List<String[]> records = reader.readAll();
            String[] headers = records.getFirst();

            int wordIndex = getIndex(headers, "ortho");
            int genderIndex = getIndex(headers, "genre");

            if (wordIndex == -1 || genderIndex == -1) {
                throw new IllegalArgumentException("File does not contain expected columns: ortho, genre");
            }

            records.parallelStream()
                    .skip(1)          // Skipping headers
                    .forEach(record -> {
                        String word = record[wordIndex];
                        String gender = record[genderIndex];
                        wordGenderMap.put(word, gender);
                    });
        }
    }

    private int getIndex(String[] headers, String columnName) {
        for (int i = 0; i < headers.length; i++) {
            if (columnName.equalsIgnoreCase(headers[i].trim())) {
                return i;
            }
        }
        return -1;
    }

    public String getGender(String word) {
        if (word == null || word.isEmpty()) {
            return "Unknown";
        }

        String normalizedWord = word.toLowerCase().trim();
        normalizedWord = removeDefiniteArticle(normalizedWord);

        return wordGenderMap.getOrDefault(normalizedWord, "Unknown");
    }

    private String removeDefiniteArticle(String word) {
        if (word.startsWith("le ") || word.startsWith("la ")) {
            return word.substring(3).trim();
        } else if (word.startsWith("l'")) {
            return word.substring(2).trim();
        } else if (word.startsWith("les ")) {
            return word.substring(4).trim();
        }
        return word;
    }

}
