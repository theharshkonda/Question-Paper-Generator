const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let questionStore = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/addQuestion', (req, res) => {
  const question = {
    question: req.body.question,
    subject: req.body.subject,
    topic: req.body.topic,
    difficulty: req.body.difficulty,
    marks: parseInt(req.body.marks),
  };

  questionStore.push(question);
  res.redirect('/');
});

app.get('/getQuestions', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(questionStore));
});

app.get('/generateQuestionPaper', (req, res) => {
  const totalMarks = 100; // Adjust as needed
  const difficultyDistribution = {
    Easy: 0.2,
    Medium: 0.5,
    Hard: 0.3,
  };

  const questionPaper = generateQuestionPaper(totalMarks, difficultyDistribution);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(questionPaper));
});

function generateQuestionPaper(totalMarks, distribution) {
  const questionPaper = [];
  const availableQuestions = { Easy: [], Medium: [], Hard: [] };

  questionStore.forEach(question => {
    availableQuestions[question.difficulty].push(question);
  });

  for (const difficulty in distribution) {
    const difficultyCount = Math.floor(totalMarks * distribution[difficulty]);
    const questions = getRandomQuestions(availableQuestions[difficulty], difficultyCount);
    questionPaper.push(...questions);
  }

  return questionPaper;
}

function getRandomQuestions(questions, count) {
  if (questions.length <= count) {
    return questions;
  }

  const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
  return shuffledQuestions.slice(0, count);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
