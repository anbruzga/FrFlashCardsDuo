package an.bruzga.flashcards.frflashcardsrestapi.flashcard;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter
    private Integer id;

    private String english;
    private String french;

    @Lob
    @Setter
    private byte[] frenchPronunciation;

    private String theme;

    @Setter
    private String gender;

    public void setEnglish(String english) {
        this.english = capitalizeFirstLetter(english);
    }

    public void setFrench(String french) {
        this.french = capitalizeFirstLetter(french);
    }

    public void setTheme(String theme) {
        this.theme = capitalizeFirstLetter(theme);
    }

    private String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
    }

    @Override
    public String toString() {
        return "Flashcard{" +
                "id=" + id +
                ", english='" + english + '\'' +
                ", french='" + french + '\'' +
                ", frenchPronunciation=" + (frenchPronunciation != null ? new String(frenchPronunciation, 0, Math.min(frenchPronunciation.length, 15)) : "null") + // display first 15 bytes, not full audio
                ", theme='" + theme + '\'' +
                ", gender='" + gender + '\'' +
                '}';
    }
}
