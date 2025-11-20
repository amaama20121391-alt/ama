const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = './data.json';

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// دریافت همه داده‌ها
app.get('/classes', (req, res) => {
  const data = readData();
  res.json(data);
});

// بروزرسانی نمره
app.post('/update-score', (req, res) => {
  const { cls, code, subject, score } = req.body;
  const data = readData();
  const student = data.classes[cls].find(s => s.code === code);
  if (student) {
    student.scores[subject] = score;
    writeData(data);
    res.json({ success: true });
  } else res.status(404).json({ error: 'دانش‌آموز یافت نشد' });
});

// اضافه کردن دانش‌آموز
app.post('/add-student', (req, res) => {
  const { cls, name, code } = req.body;
  const data = readData();
  if (!data.classes[cls]) data.classes[cls] = [];
  const newStudent = { name, code, scores: {} };
  data.subjects.forEach(sub => (newStudent.scores[sub] = ''));
  data.classes[cls].push(newStudent);
  writeData(data);
  res.json({ success: true });
});

// اضافه کردن درس
app.post('/add-subject', (req, res) => {
  const { subject } = req.body;
  const data = readData();
  if (!data.subjects.includes(subject)) {
    data.subjects.push(subject);
    for (let cls in data.classes) {
      data.classes[cls].forEach(s => (s.scores[subject] = ''));
    }
    writeData(data);
  }
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
