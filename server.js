require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const PORT = process.env.PORT || 5001;
const connectDB = require('./config/dbConnection');
connectDB();

const credentials = require('./middleware/credentials');
app.use(credentials);

app.use(express.urlencoded({ extended: false }));

const corsOptions = require('./config/corsOptions');
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

//creating upload storage
const storage = multer.diskStorage({
  destination: './uploads/images',
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use('/images', express.static('uploads/images'));

//endpoint for uploading images
app.post('/upload', upload.single('businessImage'), (req, res) => {
  console.log(`Uploaded file: ${req.file.path}`); // Logs the file path
  res.json({
    message: 'Success',
    imageUrl: `https://mrovabizbackend.onrender.com/images/${req.file.filename}`,
  });
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to MrovaBizHub backend.');
});

app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/users', require('./routes/userRoutes'));

app.all('*', (req, res) => {
  res.status(404);
  res.json({ title: 'Not found', message: 'Route not found.' });
});

mongoose.connection.once('open', () => {
  console.log('Database connected');
  app.listen(PORT, (req, res) =>
    console.log(`Server running on port: ${PORT}`)
  );
});
