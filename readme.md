## Work in Progress: Not Shareable in Current State

### Voice Data Compilation
Currently, I need to recompile the voice data to ensure it complies with the provider's terms of service for sharing. Once completed, the app will function as described below:

### App Features

#### Generic Search
Search by English, French, or Theme. Includes a pronunciation button.
![image](https://github.com/anbruzga/FrFlashCardsDuo/assets/60633443/341b9819-cb63-493f-9ee8-7beb6fd26df6)

#### Practice by Themes
![image](https://github.com/anbruzga/FrFlashCardsDuo/assets/60633443/29318bee-24a8-42b5-be7e-bb89f4635701)

#### Flashcards by Themes
![image](https://github.com/anbruzga/FrFlashCardsDuo/assets/60633443/2e247074-2cf2-44c7-a3e6-4264d703f344)

#### Installation Instructions
The current setup can run directly on a Raspberry Pi. If you prefer a different configuration, edit the IP addresses in `WebConfig` and `FlashcardService.js` to match your requirements


##### Install and run backend
   ```bash
   git clone https://github.com/anbruzga/FrFlashCardsDuo.git
   cd FrFlashCardsDuo/FrFlashcardsRestApi
   mvn clean package
   mvn spring-boot:run
   ```

##### Install and run frontend
   ```bash
   git clone https://github.com/yourusername/FrFlashCardsDuo.git
   cd FrFlashCardsDuo/FrFlashcardsReact
   npm install
   npm start
   ```



## Mentions and Disclaimers

### Lexique383 Data
This project includes data from the Lexique383 database, which provides detailed lexical information for around 140,000 French words. This data includes orthographic and phonemic representations, associated lemmas, syllabification, grammatical categories, gender and number, and frequency data from corpora of books and film subtitles.

#### License
The Lexique383 database is available under the Creative Commons BY-SA 4.0 license. For more information, visit the [official Lexique383 repository](https://github.com/chrplr/openlexicon/blob/master/datasets-info/Lexique383/README-Lexique.md) and the [Lexique383 website](http://www.lexique.org).

#### Citation
New, Boris, Christophe Pallier, Marc Brysbaert, and Ludovic Ferrand. 2004. “Lexique 2: A New French Lexical Database.” Behavior Research Methods, Instruments, & Computers 36 (3): 516–524. [PDF](http://www.lexique.org/?page_id=294).

#### Future Usage
If you plan to use or distribute this data commercially, ensure compliance with the terms of the Creative Commons BY-SA 4.0 license and consult with a legal professional if needed.

#### Contact
For further information, please refer to the [Lexique383 website](http://www.lexique.org).

### Disclaimer
This project is not affiliated with or endorsed by Duolingo. It is an independent project created to aid learners using Duolingo’s courses.