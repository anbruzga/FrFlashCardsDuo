
<h2>frontend:</h2>
<ul>
<li>docker build --tag flashcards-frontend .</li>
<li>docker run -d -p 8081:8081 --name flashcards-frontend flashcards-frontend</li>
</ul>

<h2>backend:</h2>
<ul>
<li>docker build --tag flashcards-backend . </li>
<li>docker run -d -p 9090:9090 --name flashcards-backend flashcards-backend</li>
</ul>