package an.bruzga.flashcards.frflashcardsrestapi;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

@Component
public class LexiqueDatabase {

    private static final String SERIALIZED_FILE_PATH = "wordGenderMap.ser";
    private final Map<String, String> wordGenderMap = new ConcurrentHashMap<>(10000);

    public LexiqueDatabase() {
        if (!deserializeWordGenderMap()) {
            try {
                initializeDatabase();
                serializeWordGenderMap();
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

            int wordIndex = -1;
            int genderIndex = -1;

            for (int i = 0; i < headers.length; i++) {
                String trimmedHeader = headers[i].trim();
                if (trimmedHeader.equalsIgnoreCase("ortho")) {
                    wordIndex = i;
                } else if (trimmedHeader.equalsIgnoreCase("genre")) {
                    genderIndex = i;
                }
            }

            if (wordIndex == -1 || genderIndex == -1) {
                StringBuilder errorMsg = new StringBuilder("File does not contain expected columns: ortho, genre\n");
                errorMsg.append("Available columns: ");
                for (String header : headers) {
                    errorMsg.append(header).append(", ");
                }
                throw new IllegalArgumentException(errorMsg.toString());
            }

            int finalWordIndex = wordIndex;
            int finalGenderIndex = genderIndex;

            try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
                int chunkSize = records.size() / 8;

                IntStream.range(0, 8).forEach(chunk -> {
                    int start = chunk * chunkSize + 1;
                    int end = (chunk == 7) ? records.size() : (chunk + 1) * chunkSize;
                    executor.submit(() -> {
                        for (int i = start; i < end; i++) {
                            String[] record = records.get(i);
                            String word = record[finalWordIndex];
                            String gender = record[finalGenderIndex];
                            wordGenderMap.put(word, gender);
                        }
                    });
                });
            }
        }
    }

    private void serializeWordGenderMap() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(SERIALIZED_FILE_PATH))) {
            oos.writeObject(wordGenderMap);
        } catch (IOException e) {
            throw new RuntimeException("Failed to serialize wordGenderMap", e);
        }
    }

    @SuppressWarnings("unchecked")
    private boolean deserializeWordGenderMap() {
        if (Files.exists(Paths.get(SERIALIZED_FILE_PATH))) {
            try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(SERIALIZED_FILE_PATH))) {
                Map<String, String> deserializedMap = (Map<String, String>) ois.readObject();
                wordGenderMap.putAll(deserializedMap);
                return true;
            } catch (IOException | ClassNotFoundException e) {
                throw new RuntimeException("Failed to deserialize wordGenderMap", e);
            }
        }
        return false;
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



    public static void main(String[] args) {
        try {
            LexiqueDatabase lexiqueDatabase = new LexiqueDatabase();
            String word = "chien"; // Example word
            String gender = lexiqueDatabase.getGender(word);
            System.out.println("The gender of the word '" + word + "' is: " + gender);
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
    }
}
