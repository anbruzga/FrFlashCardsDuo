## Work in Progress: 
- pronunciations recompiled to use shareable source, but need additional tidying up for the data source, as some words aren't pronounced correctly
- data source file is just too big. Need to solve that.

### App Features

#### Generic Search
Search by English, French, or Theme. Includes a pronunciation button (Some pronounciations still need tidying up ).
![image](https://github.com/anbruzga/FrFlashCardsDuo/assets/60633443/49d213e4-f495-4b13-9700-3e03de72e5a5)


#### Practice by Themes
![image](https://github.com/anbruzga/FrFlashCardsDuo/assets/60633443/98a46251-72c6-4992-b27d-9183035be978)


#### Flashcards by Themes
![image](https://github.com/anbruzga/FrFlashCardsDuo/assets/60633443/ac53dfdc-d18d-4610-9cb9-d45d0e44cc1a)


#### Installation Instructions

**UNZIP data source file manually - path is: FrFlashcardsRestApi/src/main/resources/flashcards.7z.001**. This is temporary measure.


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

There are also Dockerfiles:
   ```bash
   cd <project-dir>
   docker compose up
   ```

#### For data recompilation, see python dir readme


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


### Coqui TTS Library
The Coqui TTS library is licensed under the Mozilla Public License 2.0 (MPL-2.0). You are free to use, modify, and distribute this software under the terms of this license. For more details, refer to the [MPL-2.0 license](https://github.com/coqui-ai/TTS/blob/dev/LICENSE.txt).
#### Model Data
The models provided by Coqui TTS may have different licenses. Ensure to review the license for each model you use. You can find the specific licenses in the model descriptions on the [Coqui TTS GitHub repository](https://github.com/coqui-ai/TTS).
