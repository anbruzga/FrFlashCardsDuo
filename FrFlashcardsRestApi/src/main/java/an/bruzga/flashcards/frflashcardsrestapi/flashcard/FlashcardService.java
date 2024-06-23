package an.bruzga.flashcards.frflashcardsrestapi.flashcard;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public FlashcardService(FlashcardRepository flashcardRepository) {
        this.flashcardRepository = flashcardRepository;
    }

    public List<Flashcard> getAllFlashcards() {
        return flashcardRepository.findAll();
    }

    public Flashcard getFlashcardById(int id) {
        return flashcardRepository.findById(id).orElse(null);
    }

    public byte[] getPronunciation(int id) {
        Flashcard flashcard = flashcardRepository.findById(id).orElse(null);
        return Objects.requireNonNull(flashcard).getFrenchPronunciation();
    }

    public List<Flashcard> getFlashcardsByTheme(String theme) {
        return flashcardRepository.findByThemeIgnoreCase(theme);
    }

    public List<String> getDistinctThemes() {
        return flashcardRepository.findDistinctThemes();
    }

//    public boolean existsByFrench(String french) {
//        return flashcardRepository.existsByFrench(french);
//    }
//
//    public Flashcard saveFlashcard(Flashcard flashcard) {
//        return flashcardRepository.save(flashcard);
//    }
//
//    public void deleteFlashcard(int id) {
//        flashcardRepository.deleteById(id);
//    }
}
