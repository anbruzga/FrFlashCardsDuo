package an.bruzga.flashcards.frflashcardsrestapi.lexique;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WordGenderMapSerializer {

    private static final Logger logger = LoggerFactory.getLogger(WordGenderMapSerializer.class);

    private static final String SERIALIZED_FILE_PATH = "wordGenderMap.ser";
    private static final String CHECKSUM_FILE_PATH = SERIALIZED_FILE_PATH + ".checksum";
    private final Map<String, String> wordGenderMap = new ConcurrentHashMap<>();

    private synchronized void serializeWordGenderMap() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(SERIALIZED_FILE_PATH))) {
            oos.writeObject(wordGenderMap);
            logger.info("Serialized wordGenderMap successfully.");
        } catch (IOException e) {
            logger.error("Failed to serialize wordGenderMap", e);
            throw new RuntimeException("Failed to serialize wordGenderMap", e);
        }
    }

    @SuppressWarnings("unchecked")
    private synchronized boolean deserializeWordGenderMap() {
        if (Files.exists(Paths.get(SERIALIZED_FILE_PATH))) {
            try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(SERIALIZED_FILE_PATH))) {
                Map<String, String> deserializedMap = (Map<String, String>) ois.readObject();
                wordGenderMap.putAll(deserializedMap);
                logger.info("Deserialized wordGenderMap successfully.");
                return true;
            } catch (IOException | ClassNotFoundException e) {
                logger.error("Failed to deserialize wordGenderMap", e);
                throw new RuntimeException("Failed to deserialize wordGenderMap", e);
            }
        }
        logger.warn("Serialized file not found: {}", SERIALIZED_FILE_PATH);
        return false;
    }

    private String computeChecksum(Path path) throws IOException, NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (InputStream fis = Files.newInputStream(path);
             DigestInputStream dis = new DigestInputStream(fis, digest)) {
            while (dis.read() != -1) ; // read file data and update the digest
        }
        byte[] hash = digest.digest();
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }

    public void saveWithChecksum() {
        serializeWordGenderMap();
        try {
            String checksum = computeChecksum(Paths.get(SERIALIZED_FILE_PATH));
            Files.write(Paths.get(CHECKSUM_FILE_PATH), checksum.getBytes());
            logger.info("Saved checksum successfully: {}", checksum);
        } catch (IOException | NoSuchAlgorithmException e) {
            logger.error("Failed to write checksum", e);
            throw new RuntimeException("Failed to write checksum", e);
        }
    }

    public boolean loadWithChecksum() {
        if (!deserializeWordGenderMap()) {
            return false;
        }
        try {
            String existingChecksum = new String(Files.readAllBytes(Paths.get(CHECKSUM_FILE_PATH)));
            String computedChecksum = computeChecksum(Paths.get(SERIALIZED_FILE_PATH));
            if (existingChecksum.equals(computedChecksum)) {
                logger.info("Checksum verification successful.");
                return true;
            } else {
                logger.warn("Checksum verification failed. Expected: {}, Computed: {}", existingChecksum, computedChecksum);
                return false;
            }
        } catch (IOException | NoSuchAlgorithmException e) {
            logger.error("Failed to verify checksum", e);
            throw new RuntimeException("Failed to verify checksum", e);
        }
    }

    public void removeExistingFiles() {
        try {
            Files.deleteIfExists(Paths.get(SERIALIZED_FILE_PATH));
            Files.deleteIfExists(Paths.get(CHECKSUM_FILE_PATH));
            logger.info("Removed existing files successfully.");
        } catch (IOException e) {
            logger.error("Failed to remove existing files", e);
            throw new RuntimeException("Failed to remove existing files", e);
        }
    }

    // Example usage
    public static void main(String[] args) {
        WordGenderMapSerializer serializer = new WordGenderMapSerializer();
        serializer.removeExistingFiles();
        serializer.wordGenderMap.put("example", "gender");
        serializer.saveWithChecksum();
        if (serializer.loadWithChecksum()) {
            logger.info("Deserialization successful and checksum verified.");
        } else {
            logger.warn("Checksum verification failed.");
        }

        // Cleanup
        serializer.removeExistingFiles();
    }
}
