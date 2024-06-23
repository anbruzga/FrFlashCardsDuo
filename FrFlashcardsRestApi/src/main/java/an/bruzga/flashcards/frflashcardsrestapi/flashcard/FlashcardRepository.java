package an.bruzga.flashcards.frflashcardsrestapi.flashcard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Integer> {

    List<Flashcard> findByEnglishContainingIgnoreCase(String english);

    List<Flashcard> findByFrenchContainingIgnoreCase(String french);

    List<Flashcard> findByThemeIgnoreCase(String theme);

    @Query("SELECT DISTINCT  f.theme FROM Flashcard f")
    List<String> findDistinctThemes();

}
