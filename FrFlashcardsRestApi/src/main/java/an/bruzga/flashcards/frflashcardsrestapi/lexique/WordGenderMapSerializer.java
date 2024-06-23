package an.bruzga.flashcards.frflashcardsrestapi.lexique;

import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.*;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WordGenderMapSerializer {

    private static final String SERIALIZED_FILE_PATH = "wordGenderMap.ser";
    private static final String CHECKSUM_FILE_PATH = SERIALIZED_FILE_PATH + ".checksum";
    private final Map<String, String> wordGenderMap = new ConcurrentHashMap<>();

    private synchronized void serializeWordGenderMap() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(SERIALIZED_FILE_PATH))) {
            oos.writeObject(wordGenderMap);
        } catch (IOException e) {
            throw new RuntimeException("Failed to serialize wordGenderMap", e);
        }
    }

    @SuppressWarnings("unchecked")
    private synchronized boolean deserializeWordGenderMap() {
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
        } catch (IOException | NoSuchAlgorithmException e) {
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
            return existingChecksum.equals(computedChecksum);
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to verify checksum", e);
        }
    }

    public void removeExistingFiles() {
        try {
            Files.deleteIfExists(Paths.get(SERIALIZED_FILE_PATH));
            Files.deleteIfExists(Paths.get(CHECKSUM_FILE_PATH));
        } catch (IOException e) {
            throw new RuntimeException("Failed to remove existing files", e);
        }
    }

    // Example usage
    public static void main(String[] args) {
        WordGenderMapSerializer serializer = new WordGenderMapSerializer();

        // Remove existing checksum and serialized files
        serializer.removeExistingFiles();

        // Add example data
        serializer.wordGenderMap.put("example", "gender");

        // Serialize and save with checksum
        serializer.saveWithChecksum();

        // Deserialize and verify checksum
        if (serializer.loadWithChecksum()) {
            System.out.println("Deserialization successful and checksum verified.");
        } else {
            System.out.println("Checksum verification failed.");
        }

        // Cleanup
        serializer.removeExistingFiles();
    }
}
