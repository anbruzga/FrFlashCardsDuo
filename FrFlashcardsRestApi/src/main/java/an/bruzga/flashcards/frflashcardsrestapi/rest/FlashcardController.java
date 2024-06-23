package an.bruzga.flashcards.frflashcardsrestapi.rest;

import an.bruzga.flashcards.frflashcardsrestapi.flashcard.Flashcard;
import an.bruzga.flashcards.frflashcardsrestapi.flashcard.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping
    public List<Flashcard> getAllFlashcards() {
        return flashcardService.getAllFlashcards();
    }

    @GetMapping("/{id}")
    public Flashcard getFlashcardById(@PathVariable int id) {
        return flashcardService.getFlashcardById(id);
    }

    @GetMapping("/theme")
    public List<Flashcard> getFlashcardsByTheme(@RequestParam String theme) {
        return flashcardService.getFlashcardsByTheme(theme);
    }

    @GetMapping("/themes")
    public List<String> getDistinctThemes() {
        return flashcardService.getDistinctThemes();
    }

}
