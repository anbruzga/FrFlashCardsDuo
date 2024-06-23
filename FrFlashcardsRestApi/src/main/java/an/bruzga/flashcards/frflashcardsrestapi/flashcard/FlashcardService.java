package an.bruzga.flashcards.frflashcardsrestapi.flashcard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlashcardService {

    private final FlashcardRepository FlashcardRepository;

    @Autowired
    public FlashcardService(FlashcardRepository FlashcardRepository) {
        this.FlashcardRepository = FlashcardRepository;
    }

    public List<Flashcard> getAllFlashcards() {
        return FlashcardRepository.findAll();
    }

    public Flashcard getFlashcardById(int id) {
        return FlashcardRepository.findById(id).orElse(null);
    }

    public List<Flashcard> getFlashcardsByTheme(String theme) {
        return FlashcardRepository.findByThemeIgnoreCase(theme);
    }

    public List<String> getDistinctThemes() {
        return FlashcardRepository.findDistinctThemes();
    }


    public boolean existsByFrench(String french) {
        return FlashcardRepository.existsByFrench(french);
    }


    public Flashcard saveFlashcard(Flashcard Flashcard) {
        return FlashcardRepository.save(Flashcard);
    }

    public void deleteFlashcard(int id) {
        FlashcardRepository.deleteById(id);
    }
}
