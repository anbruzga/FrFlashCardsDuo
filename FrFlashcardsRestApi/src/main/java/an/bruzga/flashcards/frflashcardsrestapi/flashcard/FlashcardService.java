package an.bruzga.flashcards.frflashcardsrestapi.flashcard;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class FlashcardService {

    private static final Logger logger = LoggerFactory.getLogger(FlashcardService.class);

    private final FlashcardRepository flashcardRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public FlashcardService(FlashcardRepository flashcardRepository) {
        this.flashcardRepository = flashcardRepository;
    }

    public List<Flashcard> getAllFlashcards() {
        logger.info("Fetching all flashcards.");
        List<Flashcard> flashcards = flashcardRepository.findAll();
        logger.info("Found {} flashcards.", flashcards.size());
        return flashcards;
    }

    public Flashcard getFlashcardById(int id) {
        logger.info("Fetching flashcard with ID: {}", id);
        Flashcard flashcard = flashcardRepository.findById(id).orElse(null);
        if (flashcard != null) {
            logger.info("Found flashcard: {}", flashcard);
        } else {
            logger.warn("No flashcard found with ID: {}", id);
        }
        return flashcard;
    }

    public byte[] getPronunciation(int id) {
        logger.info("Fetching pronunciation for flashcard with ID: {}", id);
        Flashcard flashcard = flashcardRepository.findById(id).orElse(null);
        if (flashcard != null) {
            logger.info("Pronunciation found for flashcard with ID: {}", id);
            return flashcard.getFrenchPronunciation();
        } else {
            logger.warn("No flashcard found with ID: {}", id);
            return null;
        }
    }

    public List<Flashcard> getFlashcardsByTheme(String theme) {
        logger.info("Fetching flashcards with theme: {}", theme);
        List<Flashcard> flashcards = flashcardRepository.findByThemeIgnoreCase(theme);
        logger.info("Found {} flashcards with theme: {}", flashcards.size(), theme);
        return flashcards;
    }

    public List<String> getDistinctThemes() {
        logger.info("Fetching distinct themes.");
        List<String> themes = flashcardRepository.findDistinctThemes();
        logger.info("Found {} distinct themes.", themes.size());
        return themes;
    }
}
